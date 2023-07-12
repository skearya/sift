<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$components/ui/button';
	import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from '$components/ui/card';
	import Episodes from '$components/Episodes.svelte';

	export let data: PageData;
</script>

<section class="container px-6 lg:px-8">
	{#if data.history?.length > 0}
		<h1 class="mb-5 mt-8 text-2xl font-medium tracking-tight lg:text-3xl">Continue Watching</h1>

		<div class="flex gap-4 overflow-x-scroll">
			{#each data.history as episode}
				<a
					href={`/${episode.animeId}/${episode.providerId}/${encodeURIComponent(episode.watchId)}/${
						episode.episodeNumber
					}?time=${episode.progress || 0}`}
					class="flex h-min min-w-min items-center overflow-hidden whitespace-nowrap rounded-md border"
				>
					<div
						class="m-2 flex items-center justify-center self-stretch rounded-md bg-secondary px-3 py-2 font-medium"
					>
						<h1>{episode.animeName}</h1>
					</div>
					<h1 class="flex-grow p-1 pl-1 pr-3">
						Episode {episode.episodeNumber}
					</h1>
				</a>
			{/each}
		</div>
	{/if}

	<h1 class="mb-5 mt-8 text-2xl font-medium tracking-tight lg:text-3xl">Trending</h1>

	<div class="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-scroll">
		{#each data.trending.results as anime, i}
			<Card class="flex flex-shrink-0 basis-[16rem] snap-start flex-col">
				<CardHeader class="p-2 pb-0">
					<img
						src={anime.image}
						loading={i >= 5 ? 'lazy' : 'eager'}
						alt="Anime cover art"
						class="h-96 w-full rounded-md object-cover"
					/>
				</CardHeader>
				<div class="space-y-1.5 p-6">
					<CardTitle>{anime.title.romaji || anime.id}</CardTitle>
					<CardDescription class="flex justify-between">
						<h1>{anime.releaseDate || ''}</h1>
					</CardDescription>
				</div>
				<CardFooter class="mt-auto flex gap-x-3">
					<Episodes animeId={Number(anime.id)} />
					<Button href={`/${anime.id}`} variant="outline" class="w-full">Info</Button>
				</CardFooter>
			</Card>
		{/each}
	</div>

	<h1 class="mb-5 mt-10 text-2xl font-medium tracking-tight lg:text-3xl">Popular</h1>

	<div class="mb-8 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-scroll">
		{#each data.popular.results as anime, i}
			<Card class="flex flex-shrink-0 basis-[16rem] snap-start flex-col">
				<CardHeader class="p-2 pb-0">
					<img
						src={anime.image}
						loading={i >= 5 ? 'lazy' : 'eager'}
						alt="Anime cover art"
						class="h-96 w-full rounded-md object-cover"
					/>
				</CardHeader>
				<div class="space-y-1.5 p-6">
					<CardTitle>{anime.title.romaji || anime.id}</CardTitle>
					<CardDescription class="flex justify-between">
						<h1>{anime.releaseDate || ''}</h1>
					</CardDescription>
				</div>
				<CardFooter class="mt-auto flex gap-x-3">
					<Episodes animeId={Number(anime.id)} />
					<Button href={`/${anime.id}`} variant="outline" class="w-full">Info</Button>
				</CardFooter>
			</Card>
		{/each}
	</div>
</section>
