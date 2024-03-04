import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db, rateLimit } from '$lib/db';
import { dateToTimeGroup } from '$lib/utils/timeUtils';

import { GOOGLE_EMAIL } from '$env/static/private';
import transporter from '$lib/emailSetup.server';

import { v2 as cloudinary } from 'cloudinary';
import type { Bar, Post } from '$lib/database.types';
import { clientIp, clientTimezone } from '../../../hooks.server';

export const load: PageServerLoad = async ({ params, url, cookies, fetch }) => {
    const id = params.barId;
    const postId = url.searchParams.get("postId");
    const urlDate = url.searchParams.get("date");

    // TODO: should I put timeGroup in /api/bars/id so I can share between the two pages ?
    let todaysTimeGroup = dateToTimeGroup(new Date(), clientTimezone);
    const timeGroup = urlDate ?? todaysTimeGroup;

    let isArchivedWall = timeGroup !== todaysTimeGroup;

    const response = await fetch(`/api/bars/${id}?date=${timeGroup}`, { method: 'GET' });

    const json = await response.json();

    const bar: Bar = {
        ...json,
        posts: json.posts.map((post: any) => {
            return {
                ...post,
                date: new Date(post.date)
            }
        }) as Post[]
    }

    // if barData does not exist for id, redirect to home page.
    if (bar == null) {
        redirect(302, `/`);
    }

    const nickname = cookies.get("nickname");

    // NOTE: title below is used for site meta check src/routes/+layout.svelte
    return { title: bar.name, bar, timeGroup, nickname, postId, isArchivedWall };
};

export const actions: Actions = {
    createPost: async ({ request, cookies }) => {
        const { barId, nickname, message, imageData } = Object.fromEntries(await request.formData()) as {
            barId: string,
            nickname: string,
            message: string,
            imageData?: string,
        }

        cookies.set("nickname", nickname, { path: "/" })

        const { success } = await rateLimit.createPost.limit(
            clientIp
        )

        if (!success) {
            return { message, imageData, error: `You're posting a bit too much atm, try again in a (very) little bit`, status: 429 }
        }

        try {
            const date = new Date();
            const post = await db.post.create({
                data: {
                    nickname,
                    message,
                    barId,
                    date,
                    timeGroup: dateToTimeGroup(date, clientTimezone)
                }
            });

            if (imageData) {
                const mediaFile = await db.mediaFile.create({
                    data: {
                        postId: post.id,
                        type: 'image'
                    }
                });

                await cloudinary.uploader.upload(imageData,
                    { public_id: mediaFile.id },
                    async function (error, result) { console.log(result, error) });
            }

        } catch (err) {
            console.error(err);
            return fail(500, { error: 'Something went wrong while posting.' })
        }

        await transporter.sendMail({
            from: GOOGLE_EMAIL,
            to: "theodore.tsivranidis@gmail.com",
            subject: `new bathroom_wall post`,
            html: `<b>${nickname}</b> said: \"<a href="https://bathwall.co/bars/${barId}">${message}</a>\" <br><br> came from ip: ${clientIp}`
        });

        return {
            status: 201
        }
    }
}