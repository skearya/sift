import type { PrismaClient } from '@prisma/client';

/// <reference types="lucia" />
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
