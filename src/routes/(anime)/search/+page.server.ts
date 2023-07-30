import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { API_KEY } from '$env/static/private';
import { api, bestFallback } from '$lib/api';
import type { Anime, MinifiedAnime } from '$lib/types';

export const load = (async ({ url }) => {
	if (!url.searchParams.get('query')) throw redirect(303, '/');

	async function fetchResults() {
		try {
			let response = await api(
				`search/anime/${encodeURIComponent(url.searchParams.get('query')!)}?apikey=${API_KEY}`
			).json<Anime[]>();

			let minifiedResponse: MinifiedAnime[] = response.map((anime: Anime) => ({
				id: anime.id,
				coverImage: anime.coverImage,
				title: anime.title,
				year: anime.year,
				fallback: bestFallback(anime.artwork)
			}));

			return minifiedResponse;
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
