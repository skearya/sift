<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { preferences } from '$lib/settings';
	import { Button } from '$components/ui/button';
	import { Skeleton } from '$components/ui/skeleton';
	import { AnimeCard } from '$components/cards';
	import { Alert, AlertDescription, AlertTitle } from '$components/ui/alert';
	import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '$components/ui/card';
	import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let data: PageData;

	let nameType = get(preferences).type;
</script>

<section class="px-6 lg:px-8">
	<h1 class="mb-5 mt-8 text-2xl font-semibold tracking-tight lg:text-3xl">Results</h1>

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
				<AnimeCard
					{anime}
					{nameType}
					class="flex flex-shrink-0 basis-[16rem] snap-start scroll-ml-8 flex-col"
				/>
			{:else}
				<Alert>
					<AlertTitle class="flex gap-x-2">
						<AlertCircle class="h-4 w-4" />No results found
					</AlertTitle>
					<AlertDescription>Please try another search.</AlertDescription>
				</Alert>
			{/each}
		{:catch e}
			<Alert variant="destructive">
				<AlertTitle class="flex gap-x-2"><AlertCircle class="h-4 w-4" />Error</AlertTitle>
				<AlertDescription>{e.message}</AlertDescription>
			</Alert>
		{/await}
	</div>

	<div class="mb-6 flex justify-between">
		{#if (Number($page.url.searchParams.get('page')) || 1) !== 1}
			<Button
				href={`/search?${new URLSearchParams({
					query: $page.url.searchParams.get('query') || '',
					page: String((Number($page.url.searchParams.get('page')) || 1) - 1)
				})}`}
				class="mr-auto"><ChevronLeft /></Button
			>
		{/if}
		<Button
			href={`/search?${new URLSearchParams({
				query: $page.url.searchParams.get('query') || '',
				page: String((Number($page.url.searchParams.get('page')) || 1) + 1)
			})}`}
			class="ml-auto"
		>
			<ChevronRight />
		</Button>
	</div>
</section>
