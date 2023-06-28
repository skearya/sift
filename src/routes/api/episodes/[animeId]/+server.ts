import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import type { EpisodeData } from '$lib/types';
import { api } from '$lib/api';
import { API_KEY } from '$env/static/private';

export const GET: RequestHandler = async ({ params }) => {
	let { animeId } = params;

	if (!animeId) return json({ messsage: 'No anime id provided' }, { status: 400 });

	async function fetchEpisodes() {
		try {
			return await api(`episodes/${animeId}?apikey=${API_KEY}`, {
				timeout: 3500
			}).json<EpisodeData[]>();
		} catch (e: any) {
			return { messsage: 'Error fetching episode info' }
		}
	}

	return json(await fetchEpisodes());
};
