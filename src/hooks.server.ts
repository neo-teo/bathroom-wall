import { error, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {

    // this is where I can add rate limiting and authentication for all incoming requests

    return await resolve(event);
}