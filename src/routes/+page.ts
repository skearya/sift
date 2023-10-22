import type { PageLoad } from './$types';
import type { Anime, MinifiedAnime, MinifiedSeasonalData, SeasonalData } from '$lib/types';
import { error } from '@sveltejs/kit';
import { api, bestFallback } from '$lib/api';

export const load = (async ({ fetch, data }) => {
	async function fetchSeasonal() {
		try {
			let response = await api(`seasonal/anime?fields=[id,title,coverImage,year,artwork]`, {
				fetch
			}).json<SeasonalData>();

			let newResponse: MinifiedSeasonalData = {
				trending: [],
				popular: [],
				top: [],
				seasonal: []
			};

			for (const collection in response) {
				newResponse[collection] = response[collection].map((anime: Anime) => ({
					id: anime.id,
					coverImage: anime.coverImage,
					title: anime.title,
					year: anime.year,
					fallback: bestFallback(anime.artwork)
				}));
			}

			return newResponse;
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching homepage data',
				info: e.message
			});
		}
	}

	async function fetchRecent() {
		try {
			let response = await api(`recent?type=anime`, { fetch }).json<Anime[]>();

			let newReponse: (MinifiedAnime & { currentEpisode: number | undefined })[] = [];

			for (const anime of response) {
				newReponse.push({
					id: anime.id,
					coverImage: anime.coverImage,
					title: anime.title,
					year: anime.year,
					currentEpisode: anime.currentEpisode,
					fallback: bestFallback(anime.artwork)
				});
			}

			return newReponse;
		} catch (e: any) {
			return [];
		}
	}

	async function mergeData() {
		let [seasonal, recent] = await Promise.allSettled([fetchSeasonal(), fetchRecent()]);

		return {
			recent: recent.status == 'fulfilled' ? recent.value : [],
			...(seasonal.status == 'fulfilled' ? seasonal.value : [])
		};
	}

	return {
		...data,
		streamed: {
			anime: mergeData()
		}
	};
}) satisfies PageLoad;
