import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { API_KEY } from '$env/static/private';
import { api } from '$lib/api';

export const load = (async ({ url }) => {
	if (!url.searchParams.get('query')) throw redirect(303, '/');

	async function fetchResults() {
		try {
			return await api(
				`search/anime/${encodeURIComponent(url.searchParams.get('query')!)}?apikey=${API_KEY}`,
				{
					timeout: 3000
				}
			).json<Anime[]>();
		} catch (e: any) {
			throw error(500, e.message);
		}
	}

	return {
		streamed: {
			response: fetchResults()
		}
	};
}) satisfies PageServerLoad;

interface Anime {
	id: string;
	malId: string;
	slug: string;
	kitsuId: string;
	tvdbId?: string;
	coverImage: string;
	bannerImage: string;
	trailer: string;
	status: string;
	season: string;
	title: Title;
	currentEpisode?: number;
	mappings: Mapping[];
	synonyms: string[];
	countryOfOrigin?: string;
	description: string;
	duration: number;
	color?: string;
	year?: number;
	rating: Rating;
	popularity: Rating;
	type: string;
	format: string;
	relations: (Relation | Relations2)[];
	totalEpisodes: number;
	genres: string[];
	tags: string[];
	episodes: Episodes;
	averageRating?: number;
	averagePopularity?: number;
	artwork: Artwork[];
}

interface Artwork {
	img: string;
	type: string;
	providerId: string;
}

interface Episodes {
	data: Datum[];
	updatedAt: number | string;
}

interface Datum {
	episodes: Episode[];
	providerId: string;
}

interface Episode {
	id: string;
	img?: any;
	title: string;
	hasDub: boolean;
	number: number;
	isFiller: boolean;
}

interface Relations2 {
	id: number;
	data: Data2;
	type: string;
}

interface Data2 {
	id: number;
	type: string;
	title: Title2;
	format: string;
	status: string;
	coverImage: CoverImage;
	bannerImage?: string;
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
	english?: string;
}
