<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { Progress } from '$components/ui/progress';
	import { X } from 'lucide-svelte';

	export let data: PageData;
</script>

<section class="container min-h-screen border-x px-6 lg:px-8">
	<h1 class="pb-6 pt-8 text-2xl font-semibold tracking-tight lg:text-3xl">Watch History</h1>

	<div class="flex flex-wrap gap-3 pb-3">
		{#each data.history as episode}
			<div
				class="group relative flex min-h-full min-w-max max-w-md flex-1 flex-col whitespace-nowrap rounded-md border"
			>
				{#if episode?.cover && episode?.cover !== 'https://simkl.in/episodes/null_c.jpg'}
					<img
						src={episode.cover}
						alt="anime episode cover"
						class="max-h-28 rounded-t-md object-cover"
					/>
					<Progress
						value={((episode.progress || 0) / (episode.totalLength || 22)) * 100}
						class="h-1 rounded-none"
					/>
				{/if}
				<a
					href={`/${episode.animeId}/${episode.providerId}/${encodeURIComponent(episode.watchId)}/${
						episode.episodeNumber
					}?${new URLSearchParams({
						time: String(episode.progress),
						subType: episode.dubbed ? 'dub' : 'sub'
					})}`}
					class="h-full"
				>
					<div
						class={`flex items-center justify-between gap-x-4 p-4 ${
							episode?.cover && episode?.cover !== 'https://simkl.in/episodes/null_c.jpg'
								? ''
								: 'h-full flex-col'
						}`}
					>
						<h1
							class="line-clamp-3 max-w-[12rem] whitespace-normal font-semibold transition-colors"
						>
							{episode.animeName}
						</h1>
						<h1 class="text-muted-foreground">
							EP {episode.episodeNumber}
						</h1>
					</div>
				</a>
				<form use:enhance method="POST" class="absolute -right-3 -top-3">
					<input name="id" type="hidden" class="hidden" hidden value={episode.id} />
					<button
						class="rounded-full border bg-card p-[4px] opacity-0 transition-all group-hover:opacity-100"
					>
						<X size="23" class="text-foreground" />
					</button>
				</form>
			</div>
		{:else}
			<h1>theres nothing here yet!</h1>
		{/each}
	</div>
</section>
