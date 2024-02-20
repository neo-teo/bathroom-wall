import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db, rateLimit } from '$lib/db';
import { today } from '$lib/utils/timeUtils';

import { GOOGLE_EMAIL } from '$env/static/private';
import transporter from '$lib/emailSetup.server';

import { v2 as cloudinary } from 'cloudinary';
import type { Bar, Post } from '$lib/database.types';
import { requestIp } from '../../../hooks.server';

export const load: PageServerLoad = async ({ params, url, cookies, fetch }) => {
    const id = params.barId;
    const postId = url.searchParams.get("postId");

    const response = await fetch(`/api/bars/${id}`, { method: 'GET' });

    const json = await response.json();

    const barData: Bar = {
        ...json,
        posts: json.posts.map((post: any) => {
            return {
                ...post,
                date: new Date(post.date)
            }
        }) as Post[]
    }

    // if barData does not exist for id, redirect to home page.
    if (barData == null) {
        redirect(302, `/`);
    }

    const nickname = cookies.get("nickname");

    return { title: barData.name, bar: barData, date: today(), nickname: nickname, postId: postId };
};

export const actions: Actions = {
    createPost: async ({ request, cookies }) => {
        const { barId, nickname, message, captureData, captureAR } = Object.fromEntries(await request.formData()) as {
            barId: string,
            nickname: string,
            message: string,
            captureData?: string,
            captureAR?: string,
        }

        cookies.set("nickname", nickname, { path: "/" })

        const { success } = await rateLimit.createPost.limit(
            requestIp
        )

        if (!success) {
            return { message, captureData, captureAR, error: `You're posting a bit too much atm, try again in a (very) little bit`, status: 429 }
        }

        try {
            const post = await db.post.create({
                data: {
                    nickname,
                    message,
                    barId,
                    date: new Date(),
                }
            });

            if (captureData && captureAR) {
                const mediaFile = await db.mediaFile.create({
                    data: {
                        postId: post.id,
                        type: 'image',
                        aspectRatio: captureAR
                    }
                });

                await cloudinary.uploader.upload(captureData,
                    { public_id: mediaFile.id },
                    async function (error, result) { console.log(result, error) });
            }

        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Could not create the post.' })
        }

        await transporter.sendMail({
            from: GOOGLE_EMAIL,
            to: "theodore.tsivranidis@gmail.com",
            subject: `new bathroom_wall post`,
            html: `<b>${nickname}</b> said: \"<a href="https://bathroom-wall.netlify.app/bars/${barId}">${message}</a>\" <br><br> came from ip: ${requestIp}`
        });

        return {
            status: 201
        }
    }
}