import { db } from "$lib/db";
import { json } from "@sveltejs/kit";
import type { KnownPlaces } from "$lib/database.types";
import { barSummarySelect, flattenBarSummary, toBarSummary } from "$lib/server/bars";

const MAX_IDS = 20; // Google autocomplete returns at most 5, so this is just a guard

// Given Google place ids (?ids=a,b,c), returns the bars already on the wall for any of them.
export const GET = async ({ url }) => {
    const ids = (url.searchParams.get('ids') ?? '')
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
        .slice(0, MAX_IDS);

    if (ids.length === 0) return json({} satisfies KnownPlaces);

    const bars = await db.bar.findMany({
        where: { googleId: { in: ids } },
        select: barSummarySelect,
    });

    const known: KnownPlaces = Object.fromEntries(
        bars.map((bar) => [bar.googleId, toBarSummary(flattenBarSummary(bar))])
    );

    return json(known);
}
