import { type Handle } from "@sveltejs/kit";

export let clientIp: string;
export let clientTimezone: string;

export const handle: Handle = async ({ event, resolve }) => {

    clientIp = event.getClientAddress();
    // checking if we already have this info in cookies so we don't need to re-fetch
    if (!event.cookies.get('timezone')) {
        try {
            const response = await fetch(`http://ip-api.com/json/${clientIp}`);
            if (response.ok) {
                const data = await response.json();
                clientTimezone = data.timezone ?? 'America/New_York';

                event.cookies.set('timezone', clientTimezone, { path: '/' })
            } else {
                console.error('ip-api returned with response.ok being false', response.statusText);
            }
        } catch (error) {
            console.log("ip-api fetch failed", error)
        }
    }

    // this is where I should add authentication one day

    return await resolve(event);
}