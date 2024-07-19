import { type Handle } from "@sveltejs/kit";

export let clientIp: string;

export const handle: Handle = async ({ event, resolve }) => {

    clientIp = event.getClientAddress();

    // this is where I should add authentication one day

    return await resolve(event);
}