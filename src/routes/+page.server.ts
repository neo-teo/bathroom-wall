import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ params, cookies }) => {

    const barData = await db.bar.findMany({});

    return { bars: barData };

    throw error(404, 'Not found');
};