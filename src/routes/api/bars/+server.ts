import { db } from "$lib/db";
import { dateToTimeGroup } from "$lib/utils/timeUtils";
import { json } from "@sveltejs/kit";
import { clientTimezone } from "../../../hooks.server";
import { haversine } from "$lib/utils/geoUtils";

export const GET = async ({ url }) => {

    const lat = url.searchParams.get('lat');
    const lng = url.searchParams.get('lng');

    const timeGroup = dateToTimeGroup(new Date(), clientTimezone);

    const barData = await db.bar.findMany({
        include: {
            posts: {
                where: {
                    timeGroup: {
                        equals: timeGroup,
                    }
                }
            }
        }
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
        barData.sort((a, b) => b.posts.length - a.posts.length)
    }

    return json(barData); // otherwise json(fail(<statusCode>, ...))
}