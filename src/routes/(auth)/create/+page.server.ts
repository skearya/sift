import type { PageServerLoad, Actions } from './$types';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import { auth } from '$lib/server/lucia';
import { env } from '$env/dynamic/private';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session) throw redirect(303, '/');
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		let { request, locals } = event;

		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (typeof username !== 'string' || username.length < 4 || username.length > 31) {
			return setFlash({ type: 'error', message: 'Invalid username' }, event);
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return setFlash({ type: 'error', message: 'Invalid password' }, event);
		}

		const user = await auth.createUser({
			key: {
				providerId: 'username',
				providerUserId: username.toLowerCase(),
				password
			},
			attributes: {
				username,
				discordId: 'none',
				authorized: username == env?.OWNER_USERNAME ? true : false
			}
		});

		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});

		locals.auth.setSession(session);

		await prisma.userData.create({
			data: {
				user: {
					connect: {
						id: user.userId
					}
				}
			}
		});

		throw redirect(302, '/', { type: 'success', message: 'Created user' }, event);
	}
};
