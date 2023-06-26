<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { bestFallback } from '$lib/api';
	import { Badge } from '$components/ui/badge';
	import { Button } from '$components/ui/button';
	import { Separator } from '$components/ui/separator';
	import { Alert, AlertTitle } from '$components/ui/alert';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$components/ui/tabs';
	import Kitsu from '$lib/icons/Kitsu.svelte';
	import Simkl from '$lib/icons/Simkl.svelte';
	import AniList from '$lib/icons/AniList.svelte';
	import { AlertCircle, Play } from 'lucide-svelte';

	onMount(() => {
		let img = document.getElementById('img') as HTMLImageElement;

		if (img.naturalWidth === 0 && img.naturalHeight === 0) {
			img.src = bestFallback(data.info.artwork);
		}
	});

	export let data: PageData;

	let kitsuId = data.info.mappings.find((provider) => provider.providerId === 'kitsu')?.id;
	let simklId = data.info.mappings.find((provider) => provider.providerId === 'simkl')?.id;

	let consumet: boolean = false;
</script>

<section class="container my-10 space-y-10">
	<div class="flex flex-col gap-8 md:flex-row">
		<div
			class="max-w-[15rem] flex-shrink-0 space-y-3 self-center md:max-w-[20rem] md:self-start lg:max-w-sm"
		>
			<img
				id="img"
				src={data.info.coverImage}
				alt="anime cover"
				class="rounded-md object-cover shadow"
			/>
			<Button
				href={data.info.trailer}
				class="w-full text-base font-bold underline-offset-4 hover:underline"
			>
				<Play size="22" class="mr-2" /> Trailer
			</Button>
			<div class="flex gap-x-2">
				<Button
					href={`https://anilist.co/anime/${data.info.id}`}
					target="_blank"
					variant="outline"
					class="flex-1"
				>
					<AniList />
				</Button>
				<Button
					href={`https://kitsu.io/anime/${kitsuId}`}
					target="_blank"
					variant="outline"
					class="flex-1"
				>
					<Kitsu />
				</Button>
				<Button
					href={`https://simkl.com/anime/${simklId}`}
					target="_blank"
					variant="outline"
					class="flex-1"
				>
					<Simkl />
				</Button>
			</div>
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
		<div class="flex items-center justify-between text-4xl font-semibold">
			<h1>Episodes</h1>
			<!-- <div class="flex items-center gap-3">
				<Label class="text-sm text-muted-foreground">Consumet</Label>
				<Switch bind:rootChecked={consumet} />
			</div> -->
		</div>

		<Separator class="my-6" />

		<Tabs value={data?.episodes[0]?.providerId} class="w-full">
			<TabsList class={`mb-6 grid w-full grid-cols-1 sm:grid-cols-${data.episodes.length}`}>
				{#each data.episodes as provider}
					<TabsTrigger value={provider.providerId}>{provider.providerId}</TabsTrigger>
				{:else}
					<div class="flex w-full justify-center">
						<h1>No providers found</h1>
					</div>
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
								class="flex h-min w-full items-center overflow-hidden rounded-md border last:mb-4"
							>
								<div
									class="m-2 flex items-center justify-center self-stretch rounded-md bg-secondary px-3 py-2"
								>
									<h1 class="font-semibold">{episode.number}</h1>
								</div>
								<h1 class="flex-grow p-1 pl-1 pr-2 text-lg font-medium">
									{episode.title || episode.id}
								</h1>
								<div class="m-2 hidden min-w-[210px] overflow-hidden rounded-md md:block">
									<img
										loading="lazy"
										width="210"
										height="118"
										src={data.covers[episode.number - 1]?.img}
										alt="episode cover"
									/>
								</div>
							</a>
						{:else}
							<Alert>
								<AlertTitle class="flex gap-x-2">
									<AlertCircle class="h-4 w-4" />No episodes found
								</AlertTitle>
							</Alert>
						{/each}
					</div>
				</TabsContent>
			{/each}
		</Tabs>

		<button on:click={() => window.scrollTo({ top: 0 })} class="text-muted-foreground"
			>scroll to top
		</button>
	</div>
</section>
