import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ params, cookies }) => {

    const barData = await db.bar.findMany({});

    return { bars: barData };
};

export const actions: Actions = {
    createBar: async ({ request, cookies }) => {
        const { longName, shortName, address, googlePlaceId } = Object.fromEntries(await request.formData()) as {
            longName: string,
            shortName: string,
            address: string,
            googlePlaceId: string
        }

        let barData;
        try {
            barData = await db.bar.create({
                data: {
                    name: shortName,
                    address: address,
                    googleId: googlePlaceId
                }
            })
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Unable to create bar.' })
        }

        throw redirect(302, `/bar/` + barData.id);
    }
}