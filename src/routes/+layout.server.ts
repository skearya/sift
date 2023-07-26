import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async ({ url, locals }) => {
	const session = await locals.auth.validate();

	return {
		user: session?.user,
		url: url.pathname
	};
});
