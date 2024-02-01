import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { today, twentyFourAgo } from '$lib/utils/timeUtils';

import { GOOGLE_EMAIL } from '$env/static/private';
import transporter from '$lib/emailSetup.server';

import { v2 as cloudinary } from 'cloudinary';

export const load: PageServerLoad = async ({ params, cookies }) => {

    const id = params.barId;

    // if id isn't in url, redirect to home page.
    if (id == null) {
        throw redirect(302, `/`);
    }

    const barData = await db.bar.findUnique({
        where: {
            id: id
        },
        include: {
            posts: {
                where: {
                    date: {
                        gte: new Date(twentyFourAgo()), // Earliest date
                    }
                },
                include: {
                    media: {}
                },
                orderBy: {
                    date: 'desc'
                }
            }
        }
    });

    // if barData does not exist for id, redirect to home page.
    if (barData == null) {
        throw redirect(302, `/`);
    }

    const date = today()

    const nickname = cookies.get("nickname");

    return { bar: barData, date: date, nickname: nickname };
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

                // cloudinary.uploader.upload(captureData,
                //     { public_id: mediaFile.id },
                //     async function (error, result) {
                //         if (error) {
                //             return {
                //                 statusCode: 404,
                //                 body: JSON.stringify(error),
                //             };
                //         }
                //         return {
                //             statusCode: 200,
                //             body: JSON.stringify(result),
                //         };
                //     });
            }

        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Could not create the post.' })
        }

        await transporter.sendMail({
            from: GOOGLE_EMAIL,
            to: "theodore.tsivranidis@gmail.com",
            subject: `new bathroom_wall post`,
            text: `\"${message}\" view it here https://bathroom-wall.netlify.app/bar/${barId}`,
            html: `<b>${nickname}</b> said: \"<a href="https://bathroom-wall.netlify.app/bar/${barId}">${message}</a>\"`
        });

        return {
            status: 201
        }
    }
}