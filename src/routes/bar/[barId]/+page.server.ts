import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { today, twentyFourAgo } from '$lib/utils/timeUtils';

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

    throw error(404, 'Not found');
};

export const actions: Actions = {
    createPost: async ({ request, cookies }) => {
        const { nickname, message, barId } = Object.fromEntries(await request.formData()) as {
            nickname: string,
            message: string,
            barId: string
        }

        cookies.set("nickname", nickname, { path: "/" })

        try {
            await db.post.create({
                data: {
                    nickname,
                    message,
                    barId,
                    date: new Date()
                }
            })
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Could not create the post.' })
        }

        return {
            status: 201
        }
    }
}