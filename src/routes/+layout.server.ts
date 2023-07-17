import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async ({ url, locals }) => {
	const { user } = await locals.auth.validateUser();

	return { user, url: url.pathname };
});
