import type { RequestHandler } from './$types';
import { auth, discordAuth } from '$lib/server/lucia';
import { redirect } from 'sveltekit-flash-message/server';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async (event) => {
	let { cookies, url, locals } = event;

	const code = url.searchParams.get('code')!;
	const state = url.searchParams.get('state');

	const storedState = cookies.get('discord_oauth_state');

	if (!code) {
		throw error(404, 'code missing');
	}

	if (!state || !storedState || state !== storedState) {
		throw error(404, 'state missing/invalid');
	}

	try {
		const { getExistingUser, discordUser, createUser } = await discordAuth.validateCallback(code);

		const existingUser = await getExistingUser();
		const getUser = async () => {
			if (existingUser) return existingUser;
			return await createUser({
				attributes: {
					discordId: discordUser.id,
					username: discordUser.username,
					authorized: discordUser.id == env?.OWNER_ID ? true : false
				}
			});
		};

		const user = await getUser();
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});

		locals.auth.setSession(session);

		if (!existingUser) {
			await prisma.userData.create({
				data: {
					user: {
						connect: {
							id: user!.userId
						}
					}
				}
			});
		}
	} catch (e) {
		throw error(404, 'invalid code');
	}

	throw redirect(302, '/', { type: 'success', message: 'Logged in' }, event);
};
