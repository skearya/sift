import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { API_KEY } from '$env/static/private';
import { api } from '$lib/api';
import type { Anime, EpisodeCovers, EpisodeData } from '$lib/types';

export const load = (async ({ params, url }) => {
	let { animeId } = params;

	if (!animeId) throw redirect(303, `/search`);

	async function fetchInfo() {
		try {
			return await api(`info/${animeId}?apikey=${API_KEY}`, {
				timeout: 4000
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
			// if (url.searchParams.get('consumet')) {
			// 	return await new META.Anilist().fetchAnimeInfo(animeId);
			// } else {
			return await api(`episodes/${animeId}?apikey=${API_KEY}`, {
				timeout: 3500
			}).json<EpisodeData[]>();
			// }
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching episode info',
				info: e.message
			});
		}
	}

	async function fetchCovers() {
		return await api(`episode-covers/${animeId}?apikey=${API_KEY}`, {
			timeout: 3500
		}).json<EpisodeCovers[]>();
	}

	return {
		info: fetchInfo(),
		episodes: fetchEpisodes(),
		covers: fetchCovers()
	};
}) satisfies PageServerLoad;
