import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const { session } = await locals.auth.validateUser();

	if (session) {
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
	}

	throw redirect(303, '/login');
};
