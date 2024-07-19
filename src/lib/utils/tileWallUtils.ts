import { TILE_WALL_NUM_ROWS, TILE_WALL_NUM_COLS } from "$env/static/private";
import type { Post } from "$lib/database.types";

export function postIsOutOfBounds(post: Post): boolean {
    if (post.row === null || post.col === null) {
        return true;
    }

    if (post.row >= +TILE_WALL_NUM_ROWS || post.col >= +TILE_WALL_NUM_COLS) {
        return true;
    }

    return false;
}

export function calculateFreeSpots(posts: Post[]): Set<string> {
    const freeSpots: Set<string> = new Set();

    for (let i = 0; i < +TILE_WALL_NUM_ROWS; i++) {
        for (let j = 0; j < +TILE_WALL_NUM_COLS; j++) {
            freeSpots.add(`${i},${j}`);
        }
    }

    for (const post of posts) {
        freeSpots.delete(`${post.row},${post.col}`);
    }

    return freeSpots;
}

export function popFreeSpot(freeSpots: Set<string>): string | undefined {
    if (freeSpots.size === 0) {
        return undefined; // Set is empty, nothing to pop
    }

    const items = Array.from(freeSpots);
    const randomIndex = Math.floor(Math.random() * items.length);
    const element = items[randomIndex];
    freeSpots.delete(element);

    return element;
}