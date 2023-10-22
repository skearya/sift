import { persisted } from 'svelte-persisted-store';

export const preferences = persisted('preferences', {
	type: 'romaji' as 'romaji' | 'native' | 'english'
});
