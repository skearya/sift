import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { api, bestFallback } from '$lib/api';
import { prisma } from '$lib/server/prisma';
import { API_KEY } from '$env/static/private';
import type { Anime, MinifiedSeasonalData, SeasonalData } from '$lib/types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	async function fetchData() {
		try {
			let response = await api(`seasonal/anime?apikey=${API_KEY}`).json<SeasonalData>();

			let minifiedResponse: MinifiedSeasonalData = {
				trending: [],
				popular: [],
				top: [],
				seasonal: []
			};

			for (const collection in response) {
				minifiedResponse[collection] = response[collection].map((anime: Anime) => ({
					id: anime.id,
					coverImage: anime.coverImage,
					title: anime.title,
					year: anime.year,
					fallback: bestFallback(anime.artwork)
				}));
			}

			return minifiedResponse;
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching homepage data',
				info: e.message
			});
		}
	}

	async function fetchRecent() {
		try {
			return await api(`meta/anilist/recent-episodes`, {
				prefixUrl: 'https://api.consumet.org/'
			}).json<ConsumetRecent>();
		} catch (e: any) {
			return {} as ConsumetRecent;
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
		anime: {},
		recent: fetchRecent(),
		history: fetchHistory()
	};
}) satisfies PageServerLoad;

interface ConsumetRecent {
	currentPage: number;
	hasNextPage: boolean;
	totalPages: number;
	totalResults: number;
	results: Result[];
}

interface Result {
	id: string;
	malId: number;
	title: Title;
	image: string;
	rating?: number;
	color: string;
	episodeId: string;
	episodeTitle: string;
	episodeNumber: number;
	genres: string[];
	type: string;
}

interface Title {
	romaji: string;
	english?: string;
	native: string;
	userPreferred: string;
}
