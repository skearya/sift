<script lang="ts">
	import type { PageData } from './$types';
	import { PUBLIC_PROXY } from '$env/static/public';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { Separator } from '$components/ui/separator';
	import HLS from 'hls.js';
	import { defineCustomElements } from 'vidstack/elements';
	import 'vidstack/styles/defaults.css';
	import 'vidstack/styles/community-skin/video.css';

	export let data: PageData;
	let src: string;
	let usingProxy: boolean = false;

	for (const source of data.source.sources) {
		if (source.quality == 'default' || source.quality == 'auto') {
			src = source.url;
		}
	}

	onMount(async () => {
		await defineCustomElements();

		const player = document.querySelector('media-player')!;

		player.addEventListener('provider-change', (event) => {
			const provider = event.detail;

			if (provider?.type === 'hls') {
				// @ts-expect-error
				provider.library = HLS;
			}
		});

		player.addEventListener('error', (event) => {
			if ((event.detail.message = 'Failed to open media') && !usingProxy) {
				toast.error('Encountered CORS error, trying proxy. Switching providers is recommended.');

				player.src = {
					src: `${PUBLIC_PROXY}m3u8-proxy?url=${encodeURIComponent(
						src
					)}&headers=${encodeURIComponent(JSON.stringify(data.source.headers || {}))}`,
					type: 'application/x-mpegurl'
				};

				usingProxy = true;
			}
		});
	});
</script>

<section
	class="mx-auto min-h-screen max-w-screen-xl overflow-hidden border-b bg-popover xl:border-x"
>
	<media-player
		title={`${data.info.title.romaji} - Episode ${$page.params.episode}`}
		{src}
		aspect-ratio="16/9"
		crossorigin
		type="application/x-mpegurl"
	>
		<media-outlet>
			{#if data.source.subtitles[0]}
				<track
					src={data.source.subtitles[0].url}
					kind="subtitles"
					label={data.source.subtitles[0].lang}
					srclang="en-US"
					default
					data-type="vtt"
				/>
			{/if}
		</media-outlet>
		<media-community-skin />
	</media-player>

	<div class="p-4 md:p-6">
		<div class="flex items-center justify-between">
			<div class="space-y-1">
				<h1 class="text-2xl font-semibold tracking-tight md:text-3xl">{data.info.title.romaji}</h1>
				<h1 class="text-md capitalize text-muted-foreground md:text-lg">
					{data.info.season}
					{data.info.year}
				</h1>
			</div>

			<h1 class="text-md ml-3 whitespace-nowrap text-muted-foreground md:text-lg">
				Episode {$page.params.episode}
			</h1>
		</div>

		<Separator class="my-4" />

		<!-- <div class="flex gap-2 overflow-x-scroll">
			{#each data.episodes[0].episodes as episode}
				<a
					href="/"
					id={String(episode.number)}
					class={`rounded-sm ${
						episode.number == Number($page.params.episode) ? 'bg-primary text-black' : 'bg-muted'
					} px-4 py-2 text-muted-foreground transition-all hover:bg-primary hover:text-black`}
				>
					{episode.number}
				</a>
			{/each}
		</div> -->
	</div>
</section>

<style>
	:root {
		--video-font-family: 'Inter var';
	}
</style>
