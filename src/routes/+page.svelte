<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$components/ui/button';
	import { Progress } from '$components/ui/progress';
	import { animeId, toastState } from '$components/episodes';
	import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from '$components/ui/card';
	import { onMount } from 'svelte';

	export let data: PageData;

	onMount(() => {
		let img = document.getElementsByTagName('img');

		for (let i = 0; i < img.length; i++) {
			if (img[i].naturalWidth === 0 && img[i].naturalHeight === 0) {
				img[i].src = img[i].getAttribute('fallback') || img[i].src;
			}
		}
	});
</script>

<section class="container px-6 lg:px-8">
	{#if data.history?.length > 0}
		<h1 class="mb-5 mt-8 text-2xl font-semibold tracking-tight lg:text-3xl">Continue Watching</h1>

		<div class="flex items-stretch gap-3 overflow-x-auto">
			{#each data.history as episode}
				<a
					href={`/${episode.animeId}/${episode.providerId}/${encodeURIComponent(episode.watchId)}/${
						episode.episodeNumber
					}?${new URLSearchParams({
						time: String(episode.progress),
						subType: episode.dubbed ? 'dub' : 'sub'
					})}`}
					class="mb-3 flex min-h-full min-w-max flex-col overflow-hidden whitespace-nowrap rounded-md border"
				>
					{#if episode?.cover && episode?.cover !== 'https://simkl.in/episodes/null_c.jpg'}
						<img src={episode.cover} alt="anime episode cover" class="max-h-28 object-cover" />
						<Progress
							value={((episode.progress || 0) / (episode.totalLength || 22)) * 100}
							class="h-1 rounded-none"
						/>
					{/if}
					<div
						class={`flex items-center justify-between gap-x-4 p-4 ${
							episode?.cover && episode?.cover !== 'https://simkl.in/episodes/null_c.jpg'
								? ''
								: 'h-full flex-col'
						}`}
					>
						<h1 class="max-w-[12rem] whitespace-normal font-semibold">{episode.animeName}</h1>
						<h1 class="text-muted-foreground">
							EP {episode.episodeNumber}
						</h1>
					</div>
				</a>
			{/each}
		</div>
	{/if}

	{#each Object.keys(data.anime) as collection}
		<h1 class="mb-5 mt-8 text-2xl font-semibold tracking-tight first-letter:uppercase lg:text-3xl">
			{collection}
		</h1>

		<div class="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-scroll">
			{#each data.anime[collection] as anime, i}
				<Card class="mb-3 flex flex-shrink-0 basis-[16rem] snap-start flex-col">
					<CardHeader class="p-2 pb-0">
						<img
							src={anime.coverImage}
							alt="Anime cover art"
							loading={i >= 6 ? 'lazy' : 'eager'}
							class="h-96 w-full rounded-md object-cover"
							data-fallback={anime.fallback}
							on:error={(event) => {
								// @ts-expect-error
								if (event.target.src !== anime.fallback) {
									// @ts-expect-error
									event.target.src = anime.fallback;
								}
							}}
						/>
					</CardHeader>
					<div class="space-y-1.5 p-6">
						<CardTitle>{anime.title.romaji || anime.id}</CardTitle>
						<CardDescription class="flex justify-between">
							<h1>{anime.year || ''}</h1>
						</CardDescription>
					</div>
					<CardFooter class="mt-auto flex gap-x-3">
						<button
							on:click={() => {
								animeId.set(Number(anime.id));
								toastState.set(true)
							}}
							class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent hover:text-foreground"
						>
							Watch
						</button>
						<Button href={`/${anime.id}`} variant="outline" class="w-full">Info</Button>
					</CardFooter>
				</Card>
			{/each}
		</div>
	{/each}

	<div class="mt-10" />
</section>
