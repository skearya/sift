import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { api } from '$lib/api';

export const load = (async () => {
	async function fetchTrending() {
		try {
			return await api(`meta/anilist/trending`, {
				timeout: 3500,
				prefixUrl: 'https://api.consumet.org/'
			}).json<ConsumetResult>();
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching trending anime',
				info: e.message
			});
		}
	}

	async function fetchPopular() {
		try {
			return await api(`meta/anilist/popular`, {
				timeout: 3500,
				prefixUrl: 'https://api.consumet.org/'
			}).json<ConsumetResult>();
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching popular anime',
				info: e.message
			});
		}
	}

	return {
		trending: fetchTrending(),
		popular: fetchPopular()
	};
}) satisfies PageServerLoad;

interface ConsumetResult {
	currentPage: number;
	hasNextPage: boolean;
	results: Anime[];
}

interface Anime {
	id: string;
	malId?: number;
	title: Title;
	image: string;
	trailer: Trailer;
	description?: string;
	status: string;
	cover: string;
	rating?: number;
	releaseDate?: number;
	color?: string;
	genres: string[];
	totalEpisodes?: number;
	duration?: number;
	type: string;
}

interface Trailer {
	id?: string;
	site?: string;
	thumbnail?: string;
}

interface Title {
	romaji: string;
	english?: string;
	native: string;
	userPreferred: string;
}
