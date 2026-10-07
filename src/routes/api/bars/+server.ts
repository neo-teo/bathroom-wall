import { db } from "$lib/db";
import { json } from "@sveltejs/kit";
import { haversine } from "$lib/utils/geoUtils";
import type { BarSummary, BarSummaryPage } from "$lib/database.types";

const MAX_LIMIT = 200;

export const GET = async ({ url }) => {

    const lat = url.searchParams.get('lat');
    const lng = url.searchParams.get('lng');
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || MAX_LIMIT, 1), MAX_LIMIT);
    const offset = Math.max(Number(url.searchParams.get('offset')) || 0, 0);

    // Only what the list needs: the bar itself, how many posts it has, and when the latest one was.
    const rows = await db.bar.findMany({
        select: {
            id: true,
            name: true,
            address: true,
            uniqueName: true,
            lat: true,
            lng: true,
            _count: { select: { posts: true } },
            posts: {
                select: { date: true },
                orderBy: { date: 'desc' },
                take: 1,
            },
        },
    });

    const barData = rows.map(({ _count, posts, ...bar }) => ({
        ...bar,
        postCount: _count.posts,
        latestPostDate: posts[0]?.date ?? null,
    }));

    if (lat && lng) {
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);

        barData.sort((a, b) => {
            const distanceA = haversine(userLat, userLng, parseFloat(a.lat), parseFloat(a.lng));
            const distanceB = haversine(userLat, userLng, parseFloat(b.lat), parseFloat(b.lng));
            return distanceA - distanceB;
        });
    } else {
        // Maximums used for normalization
        const mostPosts = Math.max(1, ...barData.map(bar => bar.postCount))
        const latestDate = Math.max(1, ...barData.map(bar => bar.latestPostDate?.getTime() ?? 0))

        barData.sort((a, b) => {
            const latestA = a.latestPostDate?.getTime() ?? 0;
            const latestB = b.latestPostDate?.getTime() ?? 0;

            // Weighted score for each bar
            const scoreA = 1 * (a.postCount / mostPosts) + 1000 * (latestA / latestDate);
            const scoreB = 1 * (b.postCount / mostPosts) + 1000 * (latestB / latestDate);

            return scoreB - scoreA;
        });
    }

    const bars = barData.slice(offset, offset + limit) as unknown as BarSummary[];
    const nextOffset = offset + limit < barData.length ? offset + limit : null;

    const page: BarSummaryPage = {
        bars,
        total: barData.length,
        maxPostCount: Math.max(0, ...barData.map(bar => bar.postCount)),
        nextOffset,
    };

    return json(page); // otherwise json(fail(<statusCode>, ...))
}
