<script lang="ts">
	import type { PageData } from './$types';
	import { bestFallback } from '$lib/api';
	import { Button } from '$components/ui/button';
	import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '$components/ui/card';
	import { Skeleton } from '$components/ui/skeleton';
	import { Separator } from '$components/ui/separator';
	import { Alert, AlertDescription, AlertTitle } from '$components/ui/alert';
	import { AlertCircle } from 'lucide-svelte';

	export let data: PageData;
</script>

<section class="container">
	<h1 class="mb-5 mt-8 text-3xl font-medium tracking-tight">Results</h1>

	<div
		class="mb-6 grid auto-rows-[1fr] grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
	>
		{#await data.streamed.response}
			{#each Array(10) as _}
				<Card class="flex h-full w-full flex-col overflow-hidden">
					<CardHeader class="p-0">
						<Skeleton class="h-96 w-full rounded-none" />
					</CardHeader>
					<div class="space-y-1.5 p-6">
						<CardTitle>
							<Skeleton class="h-4 w-full" />
						</CardTitle>
						<CardDescription class="flex justify-between">
							<Skeleton class="h-4 w-1/3" />
						</CardDescription>
					</div>
					<CardFooter class="mt-auto flex-col gap-y-3">
						<Skeleton class="h-10 w-full" />
						<Skeleton class="h-10 w-full" />
					</CardFooter>
				</Card>
			{/each}
		{:then results}
			{#each results as anime}
				<Card class="flex h-full w-full flex-col overflow-hidden">
					<CardHeader class="p-2 pb-0">
						<img
							class="h-[30rem] w-full rounded-md object-cover sm:h-96"
							src={anime.coverImage}
							alt="Anime cover art"
							on:error={(event) => {
								// @ts-expect-error
								event.target.src = bestFallback(anime.artwork);
							}}
						/>
					</CardHeader>
					<div class="space-y-1.5 p-6">
						<CardTitle>{anime.title.romaji || anime.slug}</CardTitle>
						<CardDescription class="flex justify-between">
							<h1>{anime.year || ''}</h1>
						</CardDescription>
					</div>
					<CardFooter class="mt-auto flex gap-x-3">
						<Button class="w-full hover:bg-accent hover:text-white">Watch</Button>
						<Button href={`/${anime.id}`} variant="outline" class="w-full">Info</Button>
					</CardFooter>
				</Card>
			{:else}
				<Alert>
					<AlertTitle class="flex gap-x-2"
						><AlertCircle class="h-4 w-4" />No results found</AlertTitle
					>
					<AlertDescription>Please try another search.</AlertDescription>
				</Alert>
			{/each}
		{:catch error}
			<Alert variant="destructive">
				<AlertTitle class="flex gap-x-2"><AlertCircle class="h-4 w-4" />Error</AlertTitle>
				<AlertDescription>{error.message}</AlertDescription>
			</Alert>
		{/await}
	</div>
</section>
