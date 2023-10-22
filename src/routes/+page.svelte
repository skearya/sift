<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { validCover } from '$lib/api';
	import { preferences } from '$lib/settings';
	import { Progress } from '$components/ui/progress';
	import { AnimeCard, SkeletonCard } from '$components/cards';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';

	export let data: PageData;

	let nameType = get(preferences).type;

	function scroll(dir: 'left' | 'right', id: string) {
		let cards = document.getElementById(id)!;
		let width = window.innerWidth >= 1024 ? 1200 : 200;

		cards.scrollBy({
			left: dir == 'left' ? -width : width,
			behavior: 'smooth'
		});
	}

	onMount(() => {
		let img = document.getElementsByTagName('img');

		for (let i = 0; i < img.length; i++) {
			if (img[i].naturalWidth === 0 && img[i].naturalHeight === 0) {
				img[i].src = img[i].getAttribute('data-fallback') || img[i].src;
			}
		}
	});
</script>

<section>
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
					{#if validCover(episode?.cover || '')}
						<img src={episode.cover} alt="anime episode cover" class="max-h-28 object-cover" />
					{/if}
					<Progress
						value={((episode.progress || 0) / (episode.totalLength || 22 * 60)) * 100}
						class="h-1 rounded-none"
					/>
					<div
						class={`flex items-center justify-between gap-x-4 p-4 ${
							validCover(episode?.cover || '') ? '' : 'h-full flex-col'
						}`}
					>
						<h1
							class="line-clamp-2 max-w-[12rem] whitespace-normal font-semibold transition-colors"
						>
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

	{#await data.streamed.anime}
		{#each ['recent', 'trending', 'popular', 'top', 'seasonal'] as collection}
			<h1
				class="pb-6 pl-6 pt-8 text-2xl font-semibold tracking-tight first-letter:uppercase lg:pl-8 lg:text-3xl"
			>
				{collection}
			</h1>

			<div class="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto">
				{#each Array(6) as _}
					<SkeletonCard />
				{/each}
			</div>
		{/each}
	{:then anime}
		{#each Object.entries(anime) as [collection, animeCollection]}
			<div class="group relative">
				<h1
					class="pb-6 pl-6 pt-8 text-2xl font-semibold tracking-tight first-letter:uppercase lg:pl-8 lg:text-3xl"
				>
					{collection}
				</h1>

				<div
					id={collection}
					class="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-scroll"
				>
					{#each animeCollection as anime, i}
						<AnimeCard {anime} {i} {nameType} />
					{/each}
				</div>

				<button
					on:click={() => scroll('left', collection)}
					class="absolute left-12 top-1/2 rounded-full border bg-background p-2 opacity-0 transition-all group-hover:opacity-100"
				>
					<ArrowLeft size="30" />
				</button>

				<button
					on:click={() => scroll('right', collection)}
					class="absolute right-12 top-1/2 rounded-full border bg-background p-2 opacity-0 transition-all group-hover:opacity-100"
				>
					<ArrowRight size="30" />
				</button>
			</div>
		{/each}
	{/await}

	<div class="pt-8" />
</section>
