import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { API_KEY } from '$env/static/private';
import { api } from '$lib/api';
import type { Anime, EpisodeCovers, EpisodeData } from '$lib/types';

export const load = (async ({ params }) => {
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
			let json = await api(`episodes/${animeId}?apikey=${API_KEY}`, {
				timeout: 3500
			}).json<EpisodeData[]>();
			// }

			for (let i = 0; i < json.length; i++) {
				let firstItem = json[i].episodes[0].number;
				let lastItem = json[i].episodes[json[i].episodes.length - 1].number;

				if (firstItem > lastItem) {
					json[i].episodes.reverse();
				}
			}

			return json;
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching episode info',
				info: e.message
			});
		}
	}

	async function fetchCovers() {
		try {
			return await api(`episode-covers/${animeId}?apikey=${API_KEY}`, {
				timeout: 3500
			}).json<EpisodeCovers[]>();
		} catch (e: any) {
			return {} as EpisodeCovers[];
		}
	}

	return {
		info: fetchInfo(),
		episodes: fetchEpisodes(),
		covers: fetchCovers()
	};
}) satisfies PageServerLoad;
