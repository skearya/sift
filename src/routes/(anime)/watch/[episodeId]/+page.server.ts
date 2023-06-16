import type { PageServerLoad } from './$types';
import { api } from '$lib/api';
import { redirect, error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	let { episodeId } = params;

	if (!episodeId) throw redirect(303, `/search`);

	let response;
	let endpoint: string;

	// if (
	// 	provider == 'gogoanime' ||
	// 	provider == 'animepahe' ||
	// 	provider == '9anime' ||
	// 	provider == 'zoro'
	// ) {
	// 	endpoint = `${consumet}/anime/${provider}/watch/${episodeId}`;
	// } else {
	// 	endpoint = `${consumet}/anime/${provider}/watch?${new URLSearchParams({
	// 		episodeId: episodeId
	// 	})}`;
	// }

	// try {
	// 	response = await ky(endpoint, { timeout: 3000 }).json<ISource>();
	// } catch {
	// 	try {
	// 		let anime = new ANIME[convertForLibrary(provider) as keyof typeof ANIME]();

	// 		return await anime.fetchEpisodeSources(episodeId);
	// 	} catch {
	// 		throw error(404, 'Error fetching episode info');
	// 	}
	// }

	return response;
}) satisfies PageServerLoad;
