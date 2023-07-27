import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session) {
		await auth.invalidateSession(session.sessionId);

		locals.auth.setSession(null);

		await auth.deleteDeadUserSessions(session.user.userId);

		throw redirect(303, '/login');
	}

	return new Response();
};
