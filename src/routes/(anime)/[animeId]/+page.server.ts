import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { API_KEY } from '$env/static/private';
import { api } from '$lib/api';

export const load = (async ({ params }) => {
	let { animeId } = params;

	if (!animeId) throw redirect(303, `/search`);

	async function fetchInfo() {
		try {
			return await api(`info/${animeId}?apikey=${API_KEY}`, {
				timeout: 3000
			}).json<AnimeInfo>();
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
		info: fetchInfo(),
		episodes: fetchEpisodes()
	};
}) satisfies PageServerLoad;

interface AnimeInfo {
	id: string;
	malId: string;
	slug: string;
	kitsuId: string;
	tvdbId: string;
	coverImage: string;
	bannerImage: string;
	trailer: string;
	status: string;
	season: string;
	title: Title;
	currentEpisode?: any;
	mappings: Mapping[];
	synonyms: string[];
	countryOfOrigin: string;
	description: string;
	duration: number;
	color: string;
	year: number;
	rating: Rating;
	popularity: Rating;
	type: string;
	format: string;
	relations: Relation[];
	totalEpisodes: number;
	genres: string[];
	tags: string[];
	episodes: Episodes;
	averageRating: number;
	averagePopularity: number;
	artwork: Artwork[];
}

interface Artwork {
	img: string;
	type: string;
	providerId: string;
}

interface Episodes {
	data: any[];
	updatedAt: number;
}

interface Relation {
	id: number;
	data: Data;
	type: string;
}

interface Data {
	id: number;
	type: string;
	title: Title2;
	format: string;
	status: string;
	coverImage: CoverImage;
	bannerImage: string;
}

interface CoverImage {
	large: string;
}

interface Title2 {
	userPreferred: string;
}

interface Rating {
	mal: number;
	kitsu: number;
	anilist: number;
}

interface Mapping {
	id: string;
	providerId: string;
	similarity: number;
}

interface Title {
	native: string;
	romaji: string;
	english: string;
}

interface EpisodeData {
	providerId: string;
	episodes: Episode[];
}

interface Episode {
	id: string;
	number: number;
	title: string;
	isFiller: boolean;
	img?: string;
	hasDub: boolean;
}
