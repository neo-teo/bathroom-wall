import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dateToTimeGroup } from '$lib/utils/timeUtils';

import type { Bar } from '$lib/database.types';
import { db } from '$lib/db';
import { clientTimezone } from '../../../../hooks.server';

export const load: PageServerLoad = async ({ params, url, cookies, fetch }) => {
    const id = params.barId;
    const urlDate = url.searchParams.get("date");

    let todaysTimeGroup = dateToTimeGroup(new Date(), clientTimezone);
    const timeGroup = urlDate ?? todaysTimeGroup;

    let isArchivedWall = timeGroup !== todaysTimeGroup;

    const response = await fetch(`/api/bars/${id}`, { method: 'GET' });

    const json = await response.json();

    const bar: Bar = {
        ...json
    }

    const postData = await db.post.groupBy({
        by: ['timeGroup'],
        where: {
            barId: id
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

    return { title: bar.name, bar, timeGroupToCount, timeGroup, isArchivedWall };
};