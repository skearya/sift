import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const { user } = await locals.auth.validateUser();

	if (user?.authorized) {
		throw redirect(303, '/');
	}

	return {
		user
	};
}) satisfies PageServerLoad;
