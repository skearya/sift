// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
			info?: string;
		}
		// interface Locals {}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
		// interface Platform {}
	}
}

export {};
