import type { PageLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { api, bestFallback } from '$lib/api';
import type { Anime, MinifiedAnime } from '$lib/types';

export const load = (async ({ fetch, url }) => {
	if (!url.searchParams.get('query')) throw redirect(303, '/');

	async function fetchResults() {
		try {
			let response = await api(
				`search-advanced?type=anime&page=${
					url.searchParams.get('page') || 1
				}&query=${encodeURIComponent(url.searchParams.get('query')!)}`,
				{ fetch }
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
}) satisfies PageLoad;
