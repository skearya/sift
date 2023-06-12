import { loadFlashMessage } from 'sveltekit-flash-message/server';

export const load = loadFlashMessage(async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
    
	return {
		user
	};
});
