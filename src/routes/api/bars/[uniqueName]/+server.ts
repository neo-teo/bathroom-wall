import { db } from "$lib/db";
import { calculateFreeSpots, popFreeSpot, postIsOutOfBounds } from "$lib/utils/tileWallUtils";
import { fail, json } from "@sveltejs/kit";

export const GET = async ({ params, url }) => {
    const uniqueName = params.uniqueName;

    const barData = await db.bar.findUnique({
        where: {
            uniqueName: uniqueName
        },
        include: {
            posts: {
                include: {
                    media: {}
                },
                orderBy: {
                    date: 'desc'
                },
            }
        }
    });

    if (!barData) {
        return json(fail(400, { message: `Bar with unique name ${uniqueName} not found` }));
    }

    const freeSpots = calculateFreeSpots(barData.posts);

    for (let i = 0; i < barData.posts.length; i++) {
        const post = barData.posts[i];

        if (postIsOutOfBounds(post)) {
            const freeSpot = popFreeSpot(freeSpots);
            if (freeSpot) {
                const [row, col] = freeSpot.split(",");

                const updatedPost = await db.post.update({
                    where: { id: post.id },
                    data: {
                        row: +row,
                        col: +col,
                    },
                    include: {
                        media: {}
                    }
                });

                barData.posts[i] = updatedPost;
            }
        }
    }

    return json(barData);
}