<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { bestFallback } from '$lib/api';
	import { Badge } from '$components/ui/badge';
	import { Separator } from '$components/ui/separator';
	import { Alert, AlertTitle } from '$components/ui/alert';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$components/ui/tabs';
	import { AlertCircle } from 'lucide-svelte';

	onMount(() => {
		let img = document.getElementById('img') as HTMLImageElement;

		if (img.naturalWidth === 0 && img.naturalHeight === 0) {
			img.src = bestFallback(data.info.artwork);
		}
	});

	export let data: PageData;
</script>

<section class="container my-10 space-y-10">
	<div class="flex flex-col items-center gap-8 md:flex-row md:items-start">
		<div id="imgContainer" class="max-w-[15rem] flex-shrink-0 md:max-w-[20rem] lg:max-w-sm">
			<img
				id="img"
				src={data.info.coverImage}
				alt="anime cover"
				class="rounded-md object-cover shadow"
			/>
		</div>
		<div class="space-y-3">
			<h1 class="text-4xl font-semibold">{data.info.title.romaji}</h1>
			{#if data.info.season && data.info.year}
				<h1 class="text-muted-foreground">{data.info.season} {data.info.year}</h1>
			{/if}
			{#if data.info.genres}
				<div class="flex flex-wrap gap-2">
					{#each data.info.genres || [] as genre}
						<Badge variant="secondary">{genre}</Badge>
					{/each}
				</div>
			{/if}
			<div>{@html data.info.description}</div>
		</div>
	</div>

	<div>
		<h1 class="text-4xl font-semibold">Episodes</h1>

		<Separator class="my-6" />

		<Tabs value={data?.episodes[0]?.providerId} class="w-full">
			<TabsList class={`mb-6 grid w-full grid-cols-${data.episodes.length} w-full`}>
				{#each data.episodes as provider}
					<TabsTrigger value={provider.providerId}>{provider.providerId}</TabsTrigger>
				{:else}
					<h1>No providers found</h1>
				{/each}
			</TabsList>
			{#each data.episodes as provider}
				<TabsContent value={provider.providerId}>
					<div class="flex flex-col justify-center gap-4">
						{#each provider.episodes as episode}
							<a
								href={`/${data.info.id}/${provider.providerId}/${encodeURIComponent(episode.id)}/${
									episode.number
								}`}
								class="flex h-min w-full items-stretch overflow-hidden rounded-md border"
							>
								<div class="m-2 flex items-center justify-center rounded-md bg-secondary px-3">
									<h1 class="font-semibold">{episode.number}</h1>
								</div>
								<div class="flex-grow bg-transparent px-2 py-4">
									<h1 class="font-medium">{episode.title || episode.id}</h1>
								</div>
							</a>
						{:else}
							<Alert>
								<AlertTitle class="flex gap-x-2"
									><AlertCircle class="h-4 w-4" />No episodes found</AlertTitle
								>
							</Alert>
						{/each}
					</div>
				</TabsContent>
			{/each}
		</Tabs>

		<button on:click={() => window.scrollTo({ top: 0 })} class="mt-4 text-muted-foreground"
			>scroll to top</button
		>
	</div>
</section>
