import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { API_KEY } from '$env/static/private';
import { api } from '$lib/api';
import type { Anime } from '$lib/types';

export const load = (async ({ url }) => {
	if (!url.searchParams.get('query')) throw redirect(303, '/');

	async function fetchResults() {
		try {
			return await api(
				`search/anime/${encodeURIComponent(url.searchParams.get('query')!)}?apikey=${API_KEY}`
			).json<Anime[]>();
		} catch (e: any) {
			throw error(500, e.message);
		}
	}

	return {
		streamed: {
			response: fetchResults()
		}
	};
}) satisfies PageServerLoad;
