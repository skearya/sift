import type { PageLoad } from './$types';
import type { Anime, ContentMetadata, EpisodeData } from '$lib/types';
import { api } from '$lib/api';
import { error, redirect } from '@sveltejs/kit';

export const load = (async ({ fetch, params }) => {
	let { animeId } = params;

	if (!animeId) throw redirect(303, `/search`);

	async function fetchInfo() {
		try {
			return await api(`info/${animeId}`, { fetch }).json<Anime>();
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching anime info',
				info: e.message
			});
		}
	}

	async function fetchEpisodes() {
		try {
			let response = await api(`episodes/${animeId}`, { fetch }).json<EpisodeData[]>();

			for (let i = 0; i < response.length; i++) {
				let firstItem = response[i].episodes[0].number;
				let lastItem = response[i].episodes[response[i].episodes.length - 1].number;

				if (firstItem > lastItem) {
					response[i].episodes.reverse();
				}
			}

			return response;
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching episode info',
				info: e.message
			});
		}
	}

	async function fetchCovers() {
		try {
			return await api(`content-metadata/${animeId}`, { fetch }).json<ContentMetadata[]>();
		} catch (e: any) {
			return {} as ContentMetadata[];
		}
	}

	return {
		info: fetchInfo(),
		episodes: fetchEpisodes(),
		covers: fetchCovers()
	};
}) satisfies PageLoad;
