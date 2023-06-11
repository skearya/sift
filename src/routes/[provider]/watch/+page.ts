import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async () => {
	throw error(400, 'no episode id received');
}) satisfies PageLoad;
