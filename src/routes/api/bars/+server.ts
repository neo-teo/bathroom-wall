import { db } from "$lib/db";
import { json } from "@sveltejs/kit";
import { haversine } from "$lib/utils/geoUtils";

export const GET = async ({ url }) => {

    const lat = url.searchParams.get('lat');
    const lng = url.searchParams.get('lng');

    const barData = await db.bar.findMany({
        include: {
            posts: {
                orderBy: {
                    date: 'desc', // Order by date in descending order to get the most recent posts first
                },
                take: 15,
            },
        },
    });

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
        const mostPosts = Math.max(...barData.map(bar => bar.posts.length))
        const latestDate = Math.max(...barData.map(bar => bar.posts[0]?.date.getTime() ?? 0))

        barData.sort((a, b) => {
            const latestA = a.posts[0]?.date.getTime() ?? 0;
            const latestB = b.posts[0]?.date.getTime() ?? 0;

            // Weighted score for each bar
            const scoreA = 1 * (a.posts.length / mostPosts) + 1000 * (latestA / latestDate);
            const scoreB = 1 * (b.posts.length / mostPosts) + 1000 * (latestB / latestDate);

            return scoreB - scoreA;
        });
    }

    return json(barData); // otherwise json(fail(<statusCode>, ...))
}