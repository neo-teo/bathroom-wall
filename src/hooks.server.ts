import { error, type Handle } from "@sveltejs/kit";

export let requestIp: string;

export const handle: Handle = async ({ event, resolve }) => {

    requestIp = event.getClientAddress();

    // this is where I should add authentication one day

    return await resolve(event);
}