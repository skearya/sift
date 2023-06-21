import type { PageServerLoad } from './$types';
import { api } from '$lib/api';
import { redirect, error } from '@sveltejs/kit';
import { API_KEY } from '$env/static/private';
import type { Anime, EpisodeData, SourceInfo } from '$lib/types';

export const load = (async ({ params }) => {
	let { animeId, providerId, watchId, episode } = params;

	if (!episode) throw redirect(303, `/search`);

	async function fetchSource() {
		try {
			return await api(
				`sources?providerId=${providerId}&watchId=${watchId}&episode=${episode}&id=${animeId}&apikey=${API_KEY}`,
				{
					timeout: 4500
				}
			).json<SourceInfo>();
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching episode sources',
				info: e.message
			});
		}
	}

	async function fetchInfo() {
		try {
			return await api(`info/${animeId}?apikey=${API_KEY}`, {
				timeout: 3000
			}).json<Anime>();
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching anime info',
				info: e.message
			});
		}
	}

	async function fetchEpisodes() {
		try {
			return await api(`episodes/${animeId}?apikey=${API_KEY}`, {
				timeout: 3000
			}).json<EpisodeData[]>();
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching episode info',
				info: e.message
			});
		}
	}

	return {
		source: fetchSource(),
		info: fetchInfo(),
		episodes: fetchEpisodes()
	};
}) satisfies PageServerLoad;

