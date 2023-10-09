import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	async function fetchHistory() {
		return await prisma.episode.findMany({
			where: {
				UserData: { user_id: session!.user?.userId }
			},
			orderBy: { createdAt: 'desc' },
			take: 6
		});
	}

	return {
		history: fetchHistory()
	};
}) satisfies PageServerLoad;
