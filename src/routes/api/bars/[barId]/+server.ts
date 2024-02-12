import { db } from "$lib/server/db";
import { twentyFourAgo } from "$lib/utils/timeUtils";
import { json } from "@sveltejs/kit";

export const GET = async ({ params, request }) => {
    const id = params.barId;

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

    return json(barData); // otherwise json(fail(<statusCode>, ...))
}