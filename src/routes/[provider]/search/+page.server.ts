import type { PageServerLoad } from './$types';
import { consumet, providers, convertForLibrary } from '$lib/api';
import { error, redirect } from '@sveltejs/kit';
import ky from 'ky-universal';
import { ANIME, type IAnimeResult } from '@consumet/extensions';

export const load = (async ({ url, params }) => {
	if (!providers.includes(params.provider)) throw error(400, 'provider not real');
	if (!url.searchParams.get('query')) throw redirect(303, '/');

	let endpoint = `${consumet}/anime/${params.provider}/${url.searchParams.get('query')}`;

	if (url.searchParams.get('page')) {
		endpoint = endpoint.concat(`?${new URLSearchParams({ page: url.searchParams.get('page')! })}`);
	}

	async function fetchResults() {
		try {
			// the api currently does not work with enime pages
			if (params.provider == 'enime' && url.searchParams.get('page')) throw new Error();

			return await ky(endpoint, { timeout: 3000 }).json<IAnimeResult>();
		} catch {
			try {
				let provider = new ANIME[convertForLibrary(params.provider) as keyof typeof ANIME]();

				return await provider.search(
					url.searchParams.get('query')!,
					Number(url.searchParams.get('page')) || 1
				);
			} catch (e: any) {
				throw new Error(e.message);
			}
		}
	}

	return {
		streamed: {
			response: fetchResults().catch((e) => {
				throw error(404, e.message);
			})
		},
		provider: params.provider
	};
}) satisfies PageServerLoad;
