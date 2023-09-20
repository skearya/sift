import { env } from '$env/dynamic/private';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { discord } from '@lucia-auth/oauth/providers';
import { prisma } from '@lucia-auth/adapter-prisma';
import { prisma as PrismaClient } from '$lib/server/prisma';
import { dev } from '$app/environment';

export const auth = lucia({
	adapter: prisma(PrismaClient, {
		user: 'authUser',
		key: 'authKey',
		session: 'authSession'
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	sessionExpiresIn: {
		activePeriod: 1000 * 60 * 60 * 24 * 7,
		idlePeriod: 1000 * 60 * 60 * 24 * 14
	},
	getUserAttributes: (userData) => {
		return {
			discordId: userData.discordId,
			username: userData.username,
			authorized: userData.authorized
		};
	}
});

export const discordAuth = discord(auth, {
	clientId: env.CLIENT_ID!,
	clientSecret: env.CLIENT_SECRET!,
	redirectUri: env.REDIRECT_URI!
});

export type Auth = typeof auth;
