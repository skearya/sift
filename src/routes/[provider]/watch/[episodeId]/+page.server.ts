import type { PageServerLoad } from './$types';
import { consumet, providers, convertForLibrary } from '$lib/api';
import { redirect, error } from '@sveltejs/kit';
import { ANIME, type ISource } from '@consumet/extensions';
import ky from 'ky-universal';

export const load = (async ({ params }) => {
	let { provider, episodeId } = params;

	if (!providers.includes(provider)) throw error(400, 'provider not real');
	if (!episodeId) throw redirect(303, `/${provider}/search`);

	let response: ISource;
	let endpoint: string;

	if (
		provider == 'gogoanime' ||
		provider == 'animepahe' ||
		provider == '9anime' ||
		provider == 'zoro'
	) {
		endpoint = `${consumet}/anime/${provider}/watch/${episodeId}`;
	} else {
		endpoint = `${consumet}/anime/${provider}/watch?${new URLSearchParams({
			episodeId: episodeId
		})}`;
	}

	try {
		response = await ky(endpoint, { timeout: 3000 }).json<ISource>();
	} catch {
		try {
			let anime = new ANIME[convertForLibrary(provider) as keyof typeof ANIME]();

			return await anime.fetchEpisodeSources(episodeId);
		} catch {
			throw error(404, 'Error fetching episode info');
		}
	}

	return response;
}) satisfies PageServerLoad;
