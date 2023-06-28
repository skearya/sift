<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$components/ui/button';
	import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from '$components/ui/card';
	import Episodes from '$components/Episodes.svelte';

	export let data: PageData;
</script>

<section class="container">
	<h1 class="mb-5 mt-8 text-3xl font-medium tracking-tight">Trending</h1>

	<div class="flex snap-x snap-mandatory items-stretch gap-3 overflow-scroll">
		{#each data.trending.results as anime}
			<Card class="flex flex-shrink-0 basis-64 snap-start flex-col">
				<CardHeader class="p-2 pb-0">
					<img
						class="h-96 w-full rounded-md object-cover"
						src={anime.image}
						alt="Anime cover art"
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

	<h1 class="mb-5 mt-10 text-3xl font-medium tracking-tight">Popular</h1>

	<div class="mb-8 flex snap-x snap-mandatory items-stretch gap-3 overflow-scroll">
		{#each data.popular.results as anime}
			<Card class="flex flex-shrink-0 basis-64 snap-start flex-col">
				<CardHeader class="p-2 pb-0">
					<img
						class="h-96 w-full rounded-md object-cover"
						src={anime.image}
						alt="Anime cover art"
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
