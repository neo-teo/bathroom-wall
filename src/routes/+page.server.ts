import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/db';
import { GOOGLE_EMAIL } from '$env/static/private';
import transporter from '$lib/emailSetup.server';
import { twentyFourAgo } from '$lib/utils/timeUtils';
import { clientCity, clientIp } from '../hooks.server';

export const load: PageServerLoad = async ({ params, cookies }) => {

    const barData = await db.bar.findMany({
        include: {
            posts: {
                where: {
                    date: {
                        gte: new Date(twentyFourAgo()), // Earliest date
                    }
                },
                orderBy: {
                    date: 'desc'
                }
            }
        }
    });

    return { title: "bathroom wall", bars: barData, clientCity };
};

export const actions: Actions = {
    createBar: async ({ request }) => {
        const { longName, shortName, address, googlePlaceId } = Object.fromEntries(await request.formData()) as {
            longName: string,
            shortName: string,
            address: string,
            googlePlaceId: string
        }

        let barData = await db.bar.findUnique({
            where: {
                googleId: googlePlaceId
            }
        });

        // if bar already exists, redirect user to its page.
        if (barData != null) {
            redirect(302, `/bars/` + barData.id);
        }

        try {
            barData = await db.bar.create({
                data: {
                    name: shortName,
                    address: address,
                    googleId: googlePlaceId
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

        redirect(302, `/bars/` + barData.id);
    }
}