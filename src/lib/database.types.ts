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

// A bar as the homepage list sees it (from /api/bars), without its posts.
export type BarSummary = Pick<Prisma.BarGetPayload<{}>, 'id' | 'name' | 'address' | 'uniqueName' | 'lat' | 'lng' | 'googleId'> & {
    postCount: number;
    latestPostDate: string | null; // ISO date, since it comes over JSON
}

export type BarSummaryPage = {
    bars: BarSummary[];
    total: number;
    maxPostCount: number; // across all bars, not just this page, so activity squares stay comparable
    nextOffset: number | null;
}

// Bars we already have, keyed by their Google place id (from /api/known-places).
export type KnownPlaces = Record<string, BarSummary>;
