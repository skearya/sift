<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { Button } from '$components/ui/button';
	import { Progress } from '$components/ui/progress';
	import { animeId, toastState } from '$components/episodes';
	import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from '$components/ui/card';

	export let data: PageData;

	onMount(() => {
		let img = document.getElementsByTagName('img');

		for (let i = 0; i < img.length; i++) {
			if (img[i].naturalWidth === 0 && img[i].naturalHeight === 0) {
				img[i].src = img[i].getAttribute('data-fallback') || img[i].src;
			}
		}
	});
</script>

<section class="container border-x px-0">
	{#if data.history?.length > 0}
		<h1 class="pb-6 pl-6 pt-8 text-2xl font-semibold tracking-tight lg:pl-8 lg:text-3xl">
			<a href="/history" class="hover:underline">Continue Watching</a>
		</h1>

		<div class="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto">
			{#each data.history as episode}
				<a
					href={`/${episode.animeId}/${episode.providerId}/${encodeURIComponent(episode.watchId)}/${
						episode.episodeNumber
					}?${new URLSearchParams({
						time: String(episode.progress),
						subType: episode.dubbed ? 'dub' : 'sub'
					})}`}
					class="mb-3 flex min-h-full min-w-max snap-start scroll-ml-8 flex-col overflow-hidden whitespace-nowrap rounded-md border first:ml-6 last:mr-6 lg:first:ml-8 lg:last:mr-8"
				>
					{#if episode?.cover && episode?.cover !== 'https://simkl.in/episodes/null_c.jpg'}
						<img src={episode.cover} alt="anime episode cover" class="max-h-28 object-cover" />
					{/if}
					<Progress
						value={((episode.progress || 0) / (episode.totalLength || 22)) * 100}
						class="h-1 rounded-none"
					/>
					<div
						class={`flex items-center justify-between gap-x-4 p-4 ${
							episode?.cover && episode?.cover !== 'https://simkl.in/episodes/null_c.jpg'
								? ''
								: 'h-full flex-col'
						}`}
					>
						<h1 class="max-w-[12rem] whitespace-normal font-semibold transition-colors line-clamp-2">
							{episode.animeName}
						</h1>
						<h1 class="text-muted-foreground">
							EP {episode.episodeNumber}
						</h1>
					</div>
				</a>
			{/each}
		</div>
	{/if}

	{#if data.recent?.results?.length > 0}
		<h1
			class="pb-6 pl-6 pt-8 text-2xl font-semibold tracking-tight first-letter:uppercase lg:pl-8 lg:text-3xl"
		>
			Recent
		</h1>

		<div class="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-scroll">
			{#each data.recent.results as anime, i}
				<Card
					class="flex flex-shrink-0 basis-[16rem] snap-start scroll-ml-8 flex-col first:ml-6 last:mr-6 lg:first:ml-8 lg:last:mr-8"
				>
					<CardHeader class="p-2 pb-0">
						<img
							src={anime.image}
							alt="Anime cover art"
							loading={i >= 6 ? 'lazy' : 'eager'}
							class="h-96 w-full rounded-md object-cover"
						/>
					</CardHeader>
					<div class="space-y-1.5 p-6">
						<CardTitle class="line-clamp-3">{anime.title.romaji || anime.id}</CardTitle>
						<CardDescription class="flex justify-between">
							<h1>EP {anime.episodeNumber}</h1>
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
			{/each}
		</div>
	{/if}

	{#each Object.keys(data.anime) as collection}
		<h1
			class="pb-6 pl-6 pt-8 text-2xl font-semibold tracking-tight first-letter:uppercase lg:pl-8 lg:text-3xl"
		>
			{collection}
		</h1>

		<div class="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-scroll">
			{#each data.anime[collection] as anime, i}
				<Card
					class="flex flex-shrink-0 basis-[16rem] snap-start scroll-ml-8 flex-col first:ml-6 last:mr-6 lg:first:ml-8 lg:last:mr-8"
				>
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
						<CardTitle class="line-clamp-3">{anime.title.romaji || anime.id}</CardTitle>
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
			{/each}
		</div>
	{/each}

	<div class="pt-8" />
</section>
