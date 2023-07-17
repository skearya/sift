import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { OWNER_ID } from '$env/static/private';
import { redirect } from 'sveltekit-flash-message/server';

export const load = (async ({ locals }) => {
	const { user } = await locals.auth.validateUser();

	if (user?.discordId !== OWNER_ID) throw redirect(303, '/');

	let users = await prisma.authUser.findMany();

	return { users };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const { locals, request } = event;

		const { user } = await locals.auth.validateUser();

		if (user?.discordId !== OWNER_ID) throw error(401, 'Unauthorized');

		const formData = await request.formData();
		const id = formData.get('id');
		const value = formData.get('authorized');

		if (!id || !value) throw error(400, 'Bad request');

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

		throw redirect(303, '/whitelist', { type: 'success', message: 'User updated' }, event);
	}
} satisfies Actions;
