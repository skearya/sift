import type { PrismaClient } from '@prisma/client';

declare global {
	namespace App {
		interface Error {
			message: string;
			info?: string;
		}
		interface Locals {
			auth: import('lucia-auth').AuthRequest;
		}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
		// interface Platform {}
	}
	var __prisma: PrismaClient;
}

/// <reference types="lucia-auth" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type UserAttributes = {
			discordId: string;
			username: string;
			authorized: boolean;
		};
	}
}

export {};
