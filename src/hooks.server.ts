import { error, type Handle } from "@sveltejs/kit";

export let clientIp: string;
export let clientCity: string;

export const handle: Handle = async ({ event, resolve }) => {

    clientIp = event.getClientAddress();

    const response = await fetch(`http://ip-api.com/json/${clientIp}`);

    if (response.ok) {
        const data = await response.json();
        clientCity = data.city;
    } else {
        console.error('Failed to fetch city information:', response.statusText);
    }

    // this is where I should add authentication one day

    return await resolve(event);
}