import { db } from "$lib/db";
import { dateToTimeGroup } from "$lib/utils/timeUtils";
import { fail, json } from "@sveltejs/kit";
import { clientTimezone } from "../../../../hooks.server";

export const GET = async ({ params, url }) => {
    const uniqueName = params.uniqueName;
    const urlDate = url.searchParams.get("date");

    const timeGroup = urlDate ?? dateToTimeGroup(new Date(), clientTimezone);

    const barData = await db.bar.findUnique({
        where: {
            uniqueName: uniqueName
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

    if (!barData) {
        return json(fail(400, { message: `Bar with unique name ${uniqueName} not found` }));
    }

    return json(barData);
}