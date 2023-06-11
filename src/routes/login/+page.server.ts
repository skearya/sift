import { PASSWORD } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();

		const pass = formData.get('password');

		if (pass == PASSWORD) {
			cookies.set('auth', PASSWORD, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7
			});
		}

		throw redirect(303, '/');
	}
};
