<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { bestFallback } from '$lib/api';
	import { preferences } from '$lib/settings';
	import { Button } from '$components/ui/button';
	import { AniList, Kitsu, Simkl } from '$lib/icons';
	import { Play } from 'lucide-svelte';

	export let data: PageData;

	let nameType = get(preferences).type;

	let currentProvider = data.episodes.find(
		(provider) => provider.providerId == $page.params.providerId
	)!;

	let nextEp = currentProvider.episodes.find(
		(episode) => episode.number == Number($page.params.episode) + 1
	);

	let kitsuId = data.info.mappings.find((provider) => provider.providerId === 'kitsu')?.id;
	let simklId = data.info.mappings.find((provider) => provider.providerId === 'simkl')?.id;

	onMount(async () => {
		let img = document.getElementsByTagName('img');

		for (let i = 0; i < img.length; i++) {
			if (img[i].naturalWidth === 0 && img[i].naturalHeight === 0) {
				img[i].src = img[i].getAttribute('data-fallback') || img[i].src;
			}
		}
	});
</script>

<section
	class="mx-auto min-h-screen max-w-screen-xl overflow-hidden rounded-b-lg bg-popover min-[1300px]:mb-10 min-[1300px]:border-x min-[1300px]:border-b"
>
	{#await import('$components/player')}
		<div class="aspect-video h-full w-full bg-black"></div>
	{:then { Player }}
		<svelte:component
			this={Player}
			src={data.source.default}
			time={data.time}
			headers={data.source.headers}
			subtitles={data.source.subtitles}
			title={data.info.title[nameType]}
		/>
	{/await}

	<div class="p-4 md:p-6">
		<div class="space-y-1">
			<h1 class="text-2xl font-semibold tracking-tight md:text-3xl">
				{data.info.title[nameType]}
			</h1>
			<h1 class="text-md capitalize text-muted-foreground md:text-lg">
				{data.info.season}
				{data.info.year}
			</h1>
		</div>

		<div class="mt-4 flex gap-x-3">
			<Button href={`/${$page.params.animeId}`} size="lg">Anime Info</Button>

			{#if nextEp}
				<Button
					href={`/${$page.params.animeId}/${$page.params.providerId}/${encodeURIComponent(
						nextEp.id
					)}/${nextEp.number}${data.dubbed ? '/?subType=dub' : ''}`}
					variant="outline"
					size="lg"
					class="whitespace-nowrap">Next Episode</Button
				>
			{/if}
		</div>
	</div>

	<div class="border-t p-4 md:p-6">
		<div class="mb-3 flex w-min rounded-md bg-muted p-1 text-center text-muted-foreground">
			{#each data.episodes as provider}
				{@const episode = provider.episodes.find(
					(episode) => episode.number == Number($page.params.episode)
				)}
				{#if episode?.id && episode?.number}
					<a
						href={`/${$page.params.animeId}/${provider.providerId}/${encodeURIComponent(
							episode.id
						)}/${episode.number}${data.dubbed ? '/?subType=dub' : ''}`}
						class={`cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium transition-all hover:text-foreground ${
							provider.providerId == currentProvider.providerId
								? 'bg-background text-foreground'
								: ''
						}`}
					>
						<h1>{provider.providerId}</h1>
					</a>
				{/if}
			{/each}
		</div>

		<div class="flex max-h-48 flex-wrap gap-2 overflow-y-auto rounded-md bg-muted p-1">
			{#each currentProvider.episodes as episode}
				<a
					href={`/${$page.params.animeId}/${$page.params.providerId}/${encodeURIComponent(
						episode.id
					)}/${episode.number}${data.dubbed ? '/?subType=dub' : ''}`}
					id={String(episode.number)}
					class={`rounded-sm ${
						episode.number == Number($page.params.episode)
							? 'bg-background text-foreground'
							: 'text-muted-foreground'
					} px-4 py-2 font-medium transition-all hover:bg-background hover:text-foreground`}
				>
					{episode.number}
				</a>
			{/each}
		</div>
	</div>

	<div class="border-t p-4 md:p-6">
		<div class="flex flex-col gap-8 md:flex-row">
			<div class="max-w-[15rem] flex-shrink-0 space-y-3 self-center md:self-start">
				<img
					src={data.info.coverImage}
					alt="anime cover"
					class="rounded-md object-cover shadow"
					data-fallback={bestFallback(data.info.artwork)}
					on:error={(event) => {
						// @ts-ignore
						if (event.target.src !== bestFallback(data.info.artwork)) {
							// @ts-ignore
							event.target.src = bestFallback(data.info.artwork);
						}
					}}
				/>
				{#if data.info.trailer !== '' && data.info.trailer !== 'https://youtube.com/watch?v=undefined'}
					<Button
						href={data.info.trailer}
						target="_blank"
						class="w-full text-base font-bold underline-offset-4 hover:underline"
					>
						<Play size="22" class="mr-2" /> Trailer
					</Button>
				{/if}
				<div class="flex gap-x-2">
					<Button
						href={`https://anilist.co/anime/${data.info.id}`}
						target="_blank"
						variant="outline"
						class="flex-1 bg-foreground dark:bg-background"
					>
						<AniList />
					</Button>
					{#if kitsuId}
						<Button
							href={`https://kitsu.io/anime/${kitsuId}`}
							target="_blank"
							variant="outline"
							class="flex-1 bg-foreground dark:bg-background"
						>
							<Kitsu />
						</Button>
					{/if}
					{#if simklId}
						<Button
							href={`https://simkl.com/anime/${simklId}`}
							target="_blank"
							variant="outline"
							class="flex-1 bg-foreground dark:bg-background"
						>
							<Simkl />
						</Button>
					{/if}
				</div>
			</div>

			<div>{@html data.info.description}</div>
		</div>
	</div>
</section>

<style>
	:root {
		--video-font-family: 'Inter var';
		--media-aspect-ratio: 16 / 9;
	}
</style>
