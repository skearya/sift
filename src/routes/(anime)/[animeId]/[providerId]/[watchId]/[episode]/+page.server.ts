import type { PageServerLoad } from './$types';
import { api } from '$lib/api';
import { redirect, error } from '@sveltejs/kit';
import { API_KEY } from '$env/static/private';
import type { Anime, EpisodeCovers, EpisodeData, SourceInfo } from '$lib/types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ url, params, locals }) => {
	const session = await locals.auth.validate();

	let { animeId, providerId, watchId, episode } = params;

	if (!episode) throw redirect(303, `/search`);

	async function fetchSource() {
		try {
			let response = await api(
				`sources?providerId=${providerId}&watchId=${encodeURIComponent(
					watchId
				)}&episode=${episode}&id=${animeId}&subType=${
					url.searchParams.get('subType') || 'sub'
				}&apikey=${API_KEY}`
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

	async function fetchInfo() {
		let response: Anime;

		try {
			response = await api(`info/${animeId}?apikey=${API_KEY}`).json<Anime>();
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching anime info',
				info: e.message
			});
		}

		try {
			let userData = await prisma.userData.findUnique({
				where: { user_id: session!.user!.userId },
				select: {
					id: true,
					watchHistory: {
						take: 1,
						where: {
							animeId: animeId,
							UserData: {
								user_id: session!.user!.userId
							}
						}
					}
				}
			});

			let newCover: string | undefined = undefined;

			if (
				userData?.watchHistory[0]?.cover == undefined ||
				userData?.watchHistory[0]?.episodeNumber !== Number(episode)
			) {
				let response = await api(`episode-covers/${animeId}?apikey=${API_KEY}`).json<
					EpisodeCovers[]
				>();

				newCover = response[Number(episode) - 1]?.img;
			}

			await prisma.userData.update({
				where: {
					user_id: session!.user!.userId
				},
				data: {
					watchHistory: {
						upsert: {
							where: {
								animeId_userDataId: {
									animeId,
									userDataId: userData!.id
								}
							},
							create: {
								animeId,
								episodeNumber: Number(episode),
								animeName: response.title.romaji,
								providerId,
								watchId,
								cover: newCover,
								dubbed: url.searchParams.get('subType') == 'dub'
							},
							update: {
								animeId,
								episodeNumber: Number(episode),
								animeName: response.title.romaji,
								providerId,
								watchId,
								createdAt: new Date(),
								cover: newCover,
								dubbed: url.searchParams.get('subType') == 'dub',
								...(userData?.watchHistory[0]?.episodeNumber !== Number(episode)
									? { progress: 0 }
									: {})
							}
						}
					}
				}
			});
		} catch {}

		return response;
	}

	async function fetchEpisodes() {
		try {
			let response = await api(`episodes/${animeId}?apikey=${API_KEY}`).json<EpisodeData[]>();

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
		source: fetchSource(),
		info: fetchInfo(),
		episodes: fetchEpisodes(),
		time: url.searchParams.get('time'),
		dubbed: url.searchParams.get('subType') == 'dub'
	};
}) satisfies PageServerLoad;
