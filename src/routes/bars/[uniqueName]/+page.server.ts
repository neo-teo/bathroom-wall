import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/db';
import { dateToTimeGroup } from '$lib/utils/timeUtils';

import { GOOGLE_EMAIL } from '$env/static/private';
import transporter from '$lib/emailSetup.server';

import type { Bar, Post } from '$lib/database.types';
import { clientIp, clientTimezone } from '../../../hooks.server';
import { rateLimit } from '$lib/redis';

import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_SECRET } from '$env/static/private';
import { PUBLIC_CLOUDINARY_API_KEY, PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

cloudinary.config({
    cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: PUBLIC_CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

export const load: PageServerLoad = async ({ params, url, cookies, fetch }) => {
    const uniqueName = params.uniqueName;
    const postId = url.searchParams.get("postId");
    const urlDate = url.searchParams.get("date");

    // TODO: should I put timeGroup in /api/bars/id so I can share between the two pages ?
    let todaysTimeGroup = dateToTimeGroup(new Date(), clientTimezone);
    const timeGroup = urlDate ?? todaysTimeGroup;

    let isArchivedWall = timeGroup !== todaysTimeGroup;

    const response = await fetch(`/api/bars/${uniqueName}?date=${timeGroup}`, { method: 'GET' });

    const json = await response.json();

    if (json.status == 400) {
        error(404, `Woops! The bar page you're looking for doesn't seem to exist.`);
    }

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
        const { barId, barUniqueName, nickname, message, imageData } = Object.fromEntries(await request.formData()) as {
            barId: string,
            barUniqueName: string,
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

        try {
            if (imageData) {
                const mediaFile = await db.mediaFile.create({
                    data: {
                        postId: post.id,
                        type: 'image'
                    }
                });
                await cloudinary.uploader.upload(imageData,
                    { public_id: mediaFile.id },
                    async function (error, result) {
                        if (result) {
                            console.log("Cloudinary::Upload result:", result)
                        }
                        if (error) {
                            console.error("Cloudinary::Upload error:", error)
                        }
                    });
            }
        } catch (err) {
            // delete the post if something went wrong
            await db.post.delete({
                where: {
                    id: post.id
                }
            });
            return fail(500, { error: 'Something went wrong with the image you tried to upload. :(' })
        }

        await transporter.sendMail({
            from: GOOGLE_EMAIL,
            to: "theodore.tsivranidis@gmail.com",
            subject: `new bathroom_wall post`,
            html: `<b>${nickname}</b> said: \"<a href="https://bathwall.co/bars/${barUniqueName}">${message}</a>\" <br><br> came from ip: ${clientIp}`
        });

        return {
            status: 201
        }
    }
}