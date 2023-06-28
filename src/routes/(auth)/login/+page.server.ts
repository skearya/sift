import type { PageServerLoad, Actions } from './$types';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const load = (async ({ locals }) => {
	const { user } = await locals.auth.validateUser();

	if (user?.authorized) throw redirect(303, '/');
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		let { request, locals } = event;

		const form = await request.formData();
		const username = form.get('username');
		const password = form.get('password');

		if (typeof username !== 'string' || typeof password !== 'string') {
			setFlash({ type: 'error', message: 'Missing values' }, event);
			return fail(400);
		}

		try {
			const key = await auth.useKey('username', username, password);
			const session = await auth.createSession(key.userId);
			locals.auth.setSession(session);
		} catch {
			setFlash({ type: 'error', message: 'Invalid username or password' }, event);
			return fail(400);
		}

		throw redirect(302, '/', { type: 'success', message: 'Logged in' }, event);
	}
};
