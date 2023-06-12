import { auth } from '$lib/server/lucia';
import { redirect } from 'sveltekit-flash-message/server';
import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);

	const { user, session } = await event.locals.auth.validateUser();
	const { pathname } = event.url;

	if (
		pathname.startsWith('/') &&
		pathname != '/login' &&
		pathname != '/logout' &&
		!pathname.startsWith('/oauth')
	) {
		if (!session || !user.authorized) {
			throw redirect(303, '/login', { type: 'error', message: 'Unauthorized!' }, event);
		}
	}

	return await resolve(event);
}) satisfies Handle;
