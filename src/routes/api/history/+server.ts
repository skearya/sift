import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.validate();

	let { animeName, animeId, providerId, watchId, episode, length, time } = await request.json();

	let userData = await prisma.userData.findUnique({
		where: { user_id: session?.user!.userId },
		select: {
			id: true
		}
	});

	await prisma.userData.update({
		where: {
			user_id: session?.user!.userId
		},
		data: {
			watchHistory: {
				update: {
					where: {
						animeId_userDataId: {
							animeId,
							userDataId: userData!.id
						}
					},
					data: {
						animeId,
						episodeNumber: Number(episode),
						animeName,
						providerId,
						watchId,
						progress: time,
						totalLength: length,
						createdAt: new Date()
					}
				}
			}
		}
	});

	return new Response();
};
