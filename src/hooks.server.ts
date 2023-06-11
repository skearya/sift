import { PASSWORD } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/') && !(event.url.pathname == '/login')) {
		if (!(event.cookies.get('auth') == PASSWORD)) {
			throw redirect(303, '/login');
		}
	}

	return await resolve(event);
}) satisfies Handle;
