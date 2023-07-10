import type { PageServerLoad } from './$types';
import { api } from '$lib/api';
import { redirect, error } from '@sveltejs/kit';
import { API_KEY } from '$env/static/private';
import type { Anime, EpisodeData, SourceInfo } from '$lib/types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ url, params, locals }) => {
	const { user } = await locals.auth.validateUser();

	let { animeId, providerId, watchId, episode } = params;

	if (!episode) throw redirect(303, `/search`);

	async function fetchSource() {
		try {
			return await api(
				`sources?providerId=${providerId}&watchId=${watchId}&episode=${episode}&id=${animeId}&apikey=${API_KEY}`,
				{
					timeout: 4500
				}
			).json<SourceInfo>();
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
			response = await api(`info/${animeId}?apikey=${API_KEY}`, {
				timeout: 3500
			}).json<Anime>();
		} catch (e: any) {
			throw error(404, {
				message: 'Error fetching anime info',
				info: e.message
			});
		}

		let userData = await prisma.userData.findUnique({
			where: { user_id: user!.userId },
			select: { id: true }
		});

		await prisma.userData.update({
			where: {
				user_id: user!.userId
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
							watchId
						},
						update: {
							animeId,
							episodeNumber: Number(episode),
							animeName: response.title.romaji,
							providerId,
							watchId
						}
					}
				}
			}
		});

		return response;
	}

	async function fetchEpisodes() {
		try {
			return await api(`episodes/${animeId}?apikey=${API_KEY}`, {
				timeout: 3500
			}).json<EpisodeData[]>();
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
		time: url.searchParams.get('time')
	};
}) satisfies PageServerLoad;
