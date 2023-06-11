import type { PageServerLoad } from './$types';
import { consumet, providers, convertForLibrary } from '$lib/api';
import { redirect, error } from '@sveltejs/kit';
import { ANIME } from '@consumet/extensions';
import ky from 'ky-universal';

export const load = (async ({ params }) => {
	let { provider, animeId } = params;

	if (!providers.includes(provider)) throw error(400, 'provider not real');
	if (!animeId) throw redirect(303, `/${provider}/search`);

	animeId = animeId.replace('forwardslash', '/');

	let response: AnimeInfo;
	let endpoint: string;

	if (
		provider == 'gogoanime' ||
		provider == 'animepahe' ||
		provider == '9anime'
	) {
		endpoint = `${consumet}/anime/${provider}/info/${animeId}`;
	} else {
		endpoint = `${consumet}/anime/${provider}/info?${new URLSearchParams({
			id: animeId
		})}`;
	}

	try {
		response = await ky(endpoint, { timeout: 3000 }).json<AnimeInfo>();
	} catch {
		try {
			let anime = new ANIME[convertForLibrary(provider) as keyof typeof ANIME]();

			// @ts-expect-error
			response = await anime.fetchAnimeInfo(animeId);
		} catch {
			throw error(404, 'Error fetching anime info');
		}
	}

	response.image = response.image.replace('i.animepahe.ru', 'i.animepahe.com')
	return response;
}) satisfies PageServerLoad;

interface AnimeInfo {
	id: string;
	title: string;
	anilistId: number;
	malId: number;
	image: string;
	cover: string;
	season: string;
	releaseDate: number;
	duration: number;
	popularity: number;
	description: string;
	genres: string[];
	rating: number;
	status: string;
	synonyms: string[];
	mappings: Mappings;
	type: string;
	episodes: Episode[];
}

interface Episode {
	id: string;
	number: string;
	title: string;
}

interface Mappings {
	mal: number;
	anidb: number;
	kitsu: number;
	anilist: number;
	thetvdb: number;
	anisearch: number;
	livechart: number;
	'notify.moe': string;
	'anime-planet': string;
}
