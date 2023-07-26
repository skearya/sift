import type { PrismaClient } from '@prisma/client';

declare global {
	namespace App {
		interface Error {
			message: string;
			info?: string;
		}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
		// interface Platform {}
	}
	var __prisma: PrismaClient;
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			discordId: string;
			username: string;
			authorized: boolean;
		};
		type DatabaseSessionAttributes = {};
	}
}

export {};
