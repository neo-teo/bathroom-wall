import { db } from "$lib/db";
import { fail, json } from "@sveltejs/kit";

export const GET = async ({ params, url }) => {
    const uniqueName = params.uniqueName;

    const barData = await db.bar.findUnique({
        where: {
            uniqueName: uniqueName
        },
        include: {
            posts: {
                include: {
                    media: {}
                },
                orderBy: {
                    date: 'desc'
                },
            }
        }
    });

    if (!barData) {
        return json(fail(400, { message: `Bar with unique name ${uniqueName} not found` }));
    }

    return json(barData);
}