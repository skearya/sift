import type { PageServerLoad, Actions } from './$types';
import { PASSWORD } from '$env/static/private';
import { redirect, setFlash } from 'sveltekit-flash-message/server';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();

		const pass = formData.get('password');

		if (pass == PASSWORD) {
			event.cookies.set('auth', PASSWORD, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7
			});

			throw redirect(303, '/', { type: 'success', message: 'Logged in' }, event);
		} else {
			setFlash({ type: 'error', message: 'Incorrect password!' }, event);
		}
	}
} satisfies Actions;
