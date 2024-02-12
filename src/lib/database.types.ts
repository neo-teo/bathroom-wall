import type { Prisma } from "@prisma/client";

export type Post = Prisma.PostGetPayload<{
    include: {
        media: {}
    }
}>

export type Bar = Prisma.BarGetPayload<{
    include: {
        posts: {
            include: {
                media: {}
            }
        }
    }
}>