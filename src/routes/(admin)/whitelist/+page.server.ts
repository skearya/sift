import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { OWNER_ID, OWNER_USERNAME } from '$env/static/private';
import { redirect, setFlash } from 'sveltekit-flash-message/server';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session!.user?.discordId !== OWNER_ID && session!.user?.username !== OWNER_USERNAME) {
		throw redirect(303, '/');
	}

	let users = await prisma.authUser.findMany();

	return { users };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const { locals, request } = event;

		const session = await locals.auth.validate();

		if (session!.user?.discordId !== OWNER_ID && session!.user?.username !== OWNER_USERNAME) {
			throw error(401, 'Unauthorized');
		}

		const formData = await request.formData();
		const id = formData.get('id');
		const discordId = formData.get('discordId');
		const username = formData.get('username');
		const value = formData.get('authorized');

		if (!id || !discordId || !username || !value) throw error(400, 'Bad request');

		if (discordId == OWNER_ID || username == OWNER_USERNAME) {
			return setFlash({ type: 'error', message: 'You cant deauthorize an admin!' }, event);
		}

		try {
			await prisma.authUser.update({
				where: {
					id: id as string
				},
				data: {
					authorized: value === 'true'
				}
			});
		} catch {
			throw error(500, 'Error updating user');
		}

		return setFlash({ type: 'success', message: 'User updated' }, event);
	}
} satisfies Actions;
