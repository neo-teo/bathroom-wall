import { db } from '$lib/server/db';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    const { placeId } = await request.json();

    const barData = await db.bar.findUnique({
        where: {
            googleId: placeId
        }
    });

    return json({ "barData": barData });
};