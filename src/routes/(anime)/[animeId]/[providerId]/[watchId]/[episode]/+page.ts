import type { PageLoad } from './$types';
import type { EpisodeData, SourceInfo } from '$lib/types';
import { api } from '$lib/api';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch, data, url, params }) => {
	let { animeId, providerId, watchId, episode } = params;

	async function fetchSource() {
		try {
			let response = await api(
				`sources?providerId=${providerId}&watchId=${encodeURIComponent(
					watchId
				)}&episodeNumber=${episode}&id=${animeId}&subType=${
					url.searchParams.get('subType') || 'sub'
				}`,
				{ fetch }
			).json<SourceInfo>();

			if (response.sources.length == 0) throw new Error('No sources found');

			for (const source of response.sources) {
				if (source.quality == 'default' || source.quality == 'auto') {
					response.default = source.url;
					break;
				}
			}

			if (response.default == undefined) throw new Error('No playable sources found');

			return response;
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching episode sources',
				info: e.message
			});
		}
	}

	async function fetchEpisodes() {
		try {
			let response = await api(`episodes/${animeId}`, { fetch }).json<EpisodeData[]>();

			for (let i = 0; i < response.length; i++) {
				let firstItem = response[i].episodes[0].number;
				let lastItem = response[i].episodes[response[i].episodes.length - 1].number;

				if (firstItem > lastItem) {
					response[i].episodes.reverse();
				}
			}

			const providerEpisodes = response.find((provider) => provider.providerId == providerId);

			if (providerEpisodes == undefined) {
				throw Error(
					`Episode could not be found on ${providerId} anymore, please try another provider`
				);
			}

			if (url.searchParams.get('subType') == 'dub') {
				let dubbed: EpisodeData[] = [];

				response.forEach((provider) => {
					if (provider.episodes.filter((episode) => episode.hasDub).length == 0) return;

					dubbed[dubbed.length] = {
						providerId: provider.providerId,
						episodes: provider.episodes.filter((episode) => episode.hasDub)
					};
				});

				return dubbed;
			}

			return response;
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching episode info',
				info: e.message
			});
		}
	}

	return {
		...data,
		source: fetchSource(),
		episodes: fetchEpisodes(),
		time: url.searchParams.get('time'),
		dubbed: url.searchParams.get('subType') == 'dub'
	};
}) satisfies PageLoad;
