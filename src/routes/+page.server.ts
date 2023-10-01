import type { PageServerLoad } from './$types';
import type { Anime, MinifiedAnime, MinifiedSeasonalData, SeasonalData } from '$lib/types';
import { error } from '@sveltejs/kit';
import { api, bestFallback } from '$lib/api';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	async function fetchData() {
		try {
			let response = await api(
				`seasonal/anime?fields=[id,title,coverImage,year,artwork]`
			).json<SeasonalData>();

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
			let response = await api(`recent?type=anime`).json<Anime[]>();

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

	async function fetchHistory() {
		return await prisma.episode.findMany({
			where: {
				UserData: { user_id: session!.user?.userId }
			},
			orderBy: { createdAt: 'desc' },
			take: 6
		});
	}

	return {
		anime: fetchData(),
		recent: fetchRecent(),
		history: fetchHistory()
	};
}) satisfies PageServerLoad;
