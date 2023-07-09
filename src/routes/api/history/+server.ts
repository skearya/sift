import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user } = await locals.auth.validateUser();

	let { animeName, animeId, providerId, watchId, episode, length, time } = await request.json();

	await prisma.userData.update({
		where: {
			user_id: user!.userId
		},
		data: {
			watchHistory: {
				update: {
					where: {
						animeId
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
