import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	async function fetchHistory() {
		return await prisma.episode.findMany({
			where: {
				UserData: { user_id: session!.user?.userId }
			},
			orderBy: { createdAt: 'desc' }
		});
	}

	return {
		history: fetchHistory()
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const { locals, request } = event;
		const session = await locals.auth.validate();

		let form = await request.formData();
		let id = form.get('id');

		if (typeof id !== 'string') return fail(400);

		try {
			await prisma.userData.update({
				where: {
					user_id: session?.user.userId
				},
				data: {
					watchHistory: {
						delete: {
							id: id
						}
					}
				}
			});
		} catch {
			return setFlash({ type: 'error', message: 'Something went wrong' }, event);
		}

		setFlash({ type: 'success', message: 'Episode removed' }, event);
	}
};
