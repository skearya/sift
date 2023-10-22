import type { PageServerLoad } from './$types';
import type { Anime, ContentMetadata } from '$lib/types';
import { api } from '$lib/api';
import { redirect, error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ url, params, locals }) => {
	const session = await locals.auth.validate();

	let { animeId, providerId, watchId, episode } = params;

	if (!episode) throw redirect(303, `/search`);

	async function fetchInfo() {
		let response: Anime;

		try {
			response = await api(`info/${animeId}`).json<Anime>();
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
			let differentEpisode = userData?.watchHistory[0]?.episodeNumber !== Number(episode);

			if (userData?.watchHistory[0]?.cover == undefined || differentEpisode) {
				let response = await api(`content-metadata/${animeId}`).json<ContentMetadata[]>();

				newCover = response[0]?.data[Number(episode) - 1]?.img;
			}

			await prisma.userData.update({
				where: {
					user_id: session!.user.userId
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
								progress: differentEpisode ? 0 : undefined
							}
						}
					}
				}
			});
		} catch {}

		return response;
	}

	return {
		info: fetchInfo()
	};
}) satisfies PageServerLoad;
