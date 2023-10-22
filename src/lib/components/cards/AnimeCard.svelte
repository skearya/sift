<script lang="ts">
	import type { MinifiedAnime } from '$lib/types';
	import { Button } from '$components/ui/button';
	import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '$components/ui/card';
	import { animeId, toastState } from '$components/episodes';

	let classList =
		'flex flex-shrink-0 basis-[16rem] snap-start scroll-ml-8 flex-col first:ml-6 last:mr-6 lg:first:ml-8 lg:last:mr-8';

	export { classList as class };
	export let anime: MinifiedAnime;
	export let i = 0;
	export let nameType: 'romaji' | 'native' | 'english' = 'romaji';
</script>

<Card class={classList}>
	<CardHeader class="p-2 pb-0">
		<img
			src={anime.coverImage}
			alt="Anime cover art"
			loading={i >= 6 ? 'lazy' : 'eager'}
			class="h-96 w-full rounded-md object-cover"
			data-fallback={anime.fallback}
			on:error={(event) => {
				// @ts-ignore
				if (event.target.src !== anime.fallback) {
					// @ts-ignore
					event.target.src = anime.fallback;
				}
			}}
		/>
	</CardHeader>
	<div class="space-y-1.5 p-6">
		<CardTitle class="line-clamp-3 pb-[0.1em]">{anime.title[nameType] || anime.id}</CardTitle>
		<CardDescription class="flex justify-between">
			<h1>{anime.year || ''}</h1>
		</CardDescription>
	</div>
	<CardFooter class="mt-auto flex gap-x-3">
		<Button
			on:click={() => {
				animeId.set(Number(anime.id));
				toastState.set(true);
			}}
			class="w-full hover:bg-accent hover:text-foreground"
		>
			Watch
		</Button>
		<Button href={`/${anime.id}`} variant="outline" class="w-full">Info</Button>
	</CardFooter>
</Card>
