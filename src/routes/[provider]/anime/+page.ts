import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async () => {
	throw error(400, 'no anime id received');
}) satisfies PageLoad;
