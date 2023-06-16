import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async () => {
	throw error(400, 'no anime id received');
}) satisfies PageLoad;
