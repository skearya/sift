<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$components/ui/button';
	import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '$components/ui/card';
	import { Skeleton } from '$components/ui/skeleton';
	import { Separator } from '$components/ui/separator';
	import { Alert, AlertDescription, AlertTitle } from '$components/ui/alert';
	import { AlertCircle } from 'lucide-svelte';

	export let data: PageData;
</script>

<section class="container">
	<h1 class="mb-3 mt-6 text-3xl font-semibold">Top Results</h1>

	<Separator class="my-6" />

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
			{#each results.results as anime}
				<Card class="flex h-full w-full flex-col overflow-hidden">
					<CardHeader class="p-0">
						<img class="h-96 w-full object-cover" src={anime.image} alt="anime art" />
					</CardHeader>
					<div class="space-y-1.5 p-6">
						<CardTitle>{anime.title || anime.id}</CardTitle>
						<CardDescription class="flex justify-between">
							<h1>{anime.releaseDate || ''}</h1>
						</CardDescription>
					</div>
					<CardFooter class="mt-auto flex gap-x-3">
						<Button class="w-full hover:bg-accent hover:text-white">Watch</Button>
						<Button href={`/${data.provider}/anime/${anime.id.replace('/', 'forwardslash')}`} variant="outline" class="w-full"
							>Info</Button
						>
					</CardFooter>
				</Card>
			{:else}
				<Alert>
					<AlertTitle class="flex gap-x-2"
						><AlertCircle class="h-4 w-4" />No results found</AlertTitle
					>
					<AlertDescription>Please try another provider.</AlertDescription>
				</Alert>
			{/each}
		{:catch error}
			<Alert variant="destructive">
				<AlertTitle class="flex gap-x-2"><AlertCircle class="h-4 w-4" />Error</AlertTitle>
				<AlertDescription>{error.message}, please try another provider.</AlertDescription>
			</Alert>
		{/await}
	</div>
</section>
