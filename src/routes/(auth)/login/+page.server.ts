import type { PageServerLoad, Actions } from './$types';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session?.user?.authorized) throw redirect(303, '/');
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		let { request, locals } = event;

		const form = await request.formData();
		const username = form.get('username');
		const password = form.get('password');

		if (typeof username !== 'string' || typeof password !== 'string') {
			return setFlash({ type: 'error', message: 'Missing values' }, event);
		}

		try {
			const key = await auth.useKey('username', username, password);

			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});

			locals.auth.setSession(session);
		} catch {
			return setFlash({ type: 'error', message: 'Invalid username/password' }, event);
		}

		throw redirect(302, '/', { type: 'success', message: 'Logged in' }, event);
	}
};
