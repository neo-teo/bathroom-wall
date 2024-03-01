import { db } from "$lib/db";
import { dateToTimeGroup } from "$lib/utils/timeUtils";
import { json } from "@sveltejs/kit";
import { clientTimezone } from "../../../../hooks.server";

export const GET = async ({ params, url, request }) => {
    const id = params.barId;
    const urlDate = url.searchParams.get("date");

    const timeGroup = urlDate ?? dateToTimeGroup(new Date(), clientTimezone);

    const barData = await db.bar.findUnique({
        where: {
            id: id
        },
        include: {
            posts: {
                where: {
                    timeGroup: {
                        equals: timeGroup,
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