import { clientId, clientSecret, redirectUri } from '$env/static/private';
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import { discord } from '@lucia-auth/oauth/providers';
import prisma from '@lucia-auth/adapter-prisma';
import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';

export const auth = lucia({
	adapter: prisma(new PrismaClient()),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (userData) => {
		return {
			userId: userData.id,
			username: userData.username,
			authorized: userData.authorized
		};
	}
});

export const discordAuth = discord(auth, {
	clientId,
	clientSecret,
	redirectUri
});

export type Auth = typeof auth;
