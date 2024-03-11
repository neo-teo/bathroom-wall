import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/db';
import { GOOGLE_EMAIL } from '$env/static/private';
import transporter from '$lib/emailSetup.server';
import { clientIp } from '../hooks.server';
import { normalizeToKebabCase } from '$lib/utils/stringUtils';
import type { Bar } from '$lib/database.types';

export const load: PageServerLoad = async ({ url, fetch }) => {

    const lat = url.searchParams.get('lat');
    const lng = url.searchParams.get('lng');

    let endpoint = "/api/bars";
    if (lat && lng) {
        endpoint += `?lat=${lat}&lng=${lng}`;
    }

    const response = await fetch(endpoint, {
        method: 'GET'
    });

    const bars: Bar[] = await response.json();

    return { title: "bathroom wall", bars };
};

export const actions: Actions = {
    createBar: async ({ request }) => {
        const { longName, shortName, address, googlePlaceId, location, lat, lng } = Object.fromEntries(await request.formData()) as {
            longName: string,
            shortName: string,
            address: string,
            googlePlaceId: string,
            location: string,
            lat: string,
            lng: string
        }

        let barData = await db.bar.findUnique({
            where: {
                googleId: googlePlaceId
            }
        });

        // if bar already exists, redirect user to its page.
        if (barData != null) {
            redirect(302, `/bars/` + barData.uniqueName);
        }

        let uniqueName = await uniqueNameForBar(shortName, location);

        try {
            barData = await db.bar.create({
                data: {
                    name: shortName,
                    address,
                    googleId: googlePlaceId,
                    uniqueName,
                    lat,
                    lng
                }
            })
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Unable to create bar.' })
        }

        await transporter.sendMail({
            from: GOOGLE_EMAIL,
            to: "theodore.tsivranidis@gmail.com",
            subject: `someone added a bar to bathroom_wall`,
            html: `<b>${barData.name}</b> at <i>${barData.address}</i> got added <br><br> came from ip: ${clientIp}`
        });

        redirect(302, `/bars/` + barData.uniqueName);
    }
}

const uniqueNameForBar = async (name: string, location: string) => {
    let normalizedName = normalizeToKebabCase(name);
    let normalizedLocation = normalizeToKebabCase(location);

    let uniqueName = normalizedName;

    let counter = 0; // Used only for appending as a suffix if needed.

    while (true) {
        const exists = await db.bar.findUnique({
            where: { uniqueName: uniqueName },
        });

        if (!exists) break; // Unique name found.

        uniqueName = counter === 0
            ? `${normalizedName}-${normalizedLocation}`
            : `${normalizedName}-${normalizedLocation}-${counter}`;

        counter++; // Increment to ensure uniqueness in the next iteration if needed.
    }

    return uniqueName;
}