import { error, type Handle } from "@sveltejs/kit";

export let clientIp: string;
export let clientCity: string;

export const handle: Handle = async ({ event, resolve }) => {

    clientIp = event.getClientAddress();

    // Make a request to a free IP geolocation API
    const response = await fetch(`http://ip-api.com/json/${clientIp}`);

    if (response.ok) {
        const data = await response.json();
        // Extract the city from the response
        clientCity = data.city;
        // clientCity = "New York"
    } else {
        console.error('Failed to fetch city information:', response.statusText);
    }

    // this is where I should add authentication one day

    return await resolve(event);
}