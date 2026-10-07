import type { Prisma } from "@prisma/client";
import type { BarSummary } from "$lib/database.types";

// Only what a list row needs: the bar itself, how many posts it has, and when the latest one was.
export const barSummarySelect = {
    id: true,
    name: true,
    address: true,
    uniqueName: true,
    lat: true,
    lng: true,
    googleId: true,
    _count: { select: { posts: true } },
    posts: {
        select: { date: true },
        orderBy: { date: 'desc' },
        take: 1,
    },
} satisfies Prisma.BarSelect;

type BarSummaryRow = Prisma.BarGetPayload<{ select: typeof barSummarySelect }>;

// Flattens a selected row; `latestPostDate` stays a Date so callers can sort on it.
export function flattenBarSummary({ _count, posts, ...bar }: BarSummaryRow) {
    return {
        ...bar,
        postCount: _count.posts,
        latestPostDate: posts[0]?.date ?? null,
    };
}

// Dates go out as ISO strings, which is what BarSummary describes.
export function toBarSummary(bar: ReturnType<typeof flattenBarSummary>): BarSummary {
    return { ...bar, latestPostDate: bar.latestPostDate?.toISOString() ?? null };
}
