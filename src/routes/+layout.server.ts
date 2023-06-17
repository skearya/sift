import { loadFlashMessage } from 'sveltekit-flash-message/server';

export const load = loadFlashMessage(async ({ url, locals }) => {
	const { user } = await locals.auth.validateUser();

	return { user, url: url.pathname };
});
