import type { PageServerLoad } from './$types';
import { api } from '$lib/api';
import { redirect, error } from '@sveltejs/kit';
import { API_KEY } from '$env/static/private';

export const load = (async ({ params }) => {
	let { animeId, providerId, watchId, episode } = params;

	if (!episode) throw redirect(303, `/search`);

	let response: SourceInfo;

	try {
		response = await api(
			`sources?providerId=${providerId}&watchId=${watchId}&episode=${episode}&id=${animeId}&apikey=${API_KEY}`,
			{ timeout: 4500 }
		).json<SourceInfo>();
	} catch {
		throw error(404, 'Error fetching episode sources');
	}

	return response;
}) satisfies PageServerLoad;

interface SourceInfo {
	sources: Source[];
	subtitles: any[];
	intro: Intro;
	outro: Intro;
	headers: Headers;
}

interface Headers {
	Referer: string;
}

interface Intro {
	end: number;
	start: number;
}

interface Source {
	url: string;
	quality: string;
}
