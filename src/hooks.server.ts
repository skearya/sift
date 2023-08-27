import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);

	const session = await event.locals.auth.validate();
	const { pathname } = event.url;

	if (
		pathname.startsWith('/') &&
		pathname != '/create' &&
		pathname != '/login' &&
		pathname != '/logout' &&
		pathname != '/dmca' &&
		!pathname.startsWith('/oauth')
	) {
		if (!session || !session.user.authorized) {
			throw redirect(303, '/login');
		}
	}

	return await resolve(event);
}) satisfies Handle;
