import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { api, bestFallback } from '$lib/api';
import { prisma } from '$lib/server/prisma';
import { API_KEY } from '$env/static/private';
import type { Anime, SeasonalData } from '$lib/types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	async function fetchData() {
		try {
			let response = await api(`seasonal/anime?apikey=${API_KEY}`).json<any>();

			for (const collection in response) {
				response[collection] = response[collection].map((anime: Anime) => ({
					id: anime.id,
					coverImage: anime.coverImage,
					title: anime.title,
					year: anime.year,
					fallback: bestFallback(anime.artwork)
				}));
			}

			return response as SeasonalData;
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching homepage data',
				info: e.message
			});
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
		history: fetchHistory()
	};
}) satisfies PageServerLoad;
