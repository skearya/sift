import { persisted } from 'svelte-local-storage-store';
import type { Writable } from 'svelte/store';

type providers = '9anime' | 'animefox' | 'animepahe' | 'enime' | 'gogoanime' | 'zoro';

export const provider: Writable<providers> = persisted('provider', 'gogoanime');
