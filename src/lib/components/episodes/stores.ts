import { writable } from 'svelte/store';

export let toastState = writable<boolean>(false);
export let animeId = writable<number>(21);
