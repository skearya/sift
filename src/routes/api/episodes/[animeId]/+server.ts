import type { RequestHandler } from './$types';
import type { EpisodeData } from '$lib/types';
import { json } from '@sveltejs/kit';
import { api } from '$lib/api';

export const GET: RequestHandler = async ({ params }) => {
	let { animeId } = params;

	if (!animeId) return json({ messsage: 'No anime id provided' }, { status: 400 });

	async function fetchEpisodes() {
		try {
			return await api(`episodes/${animeId}`).json<EpisodeData[]>();
		} catch (e: any) {
			return { messsage: 'Error fetching episode info' };
		}
	}

	return json(await fetchEpisodes());
};
