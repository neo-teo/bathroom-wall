import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import type { Bar } from '$lib/database.types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ params, url, fetch }) => {
    const uniqueName = params.uniqueName;
    const urlDate = url.searchParams.get("date");

    const response = await fetch(`/api/bars/${uniqueName}`, { method: 'GET' });

    const json = await response.json();

    const bar: Bar = {
        ...json
    }

    const postData = await db.post.groupBy({
        by: ['timeGroup'],
        where: {
            barId: bar.id
        },
        _count: {
            timeGroup: true
        },
    });

    const timeGroupToCount = postData.reduce((map, item) => {
        map.set(item.timeGroup, item._count.timeGroup);
        return map;
    }, new Map<string, number>());

    // if barData does not exist for id, redirect to home page.
    if (bar == null) {
        redirect(302, `/`);
    }

    return { title: bar.name, bar, timeGroupToCount, urlDate };
};