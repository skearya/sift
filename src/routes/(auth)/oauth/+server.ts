import type { RequestHandler } from './$types';
import { discordAuth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	const [url, state] = await discordAuth.getAuthorizationUrl();

	cookies.set('discord_oauth_state', state, {
		path: '/',
		maxAge: 60 * 60
	});

	throw redirect(302, url.toString());
};
