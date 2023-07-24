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
	let interval: NodeJS.Timer;
	let usingProxy: boolean = false;

	onMount(async () => {
		await defineCustomElements();

		const player = document.querySelector('media-player')!;

		player.onAttach(() => {
			if (data.time) player.currentTime = Number(data.time);

			interval = setInterval(() => {
				if (!player.state.playing) return;

				const { animeId, providerId, watchId, episode } = $page.params;

				fetch('/api/history', {
					method: 'POST',
					body: JSON.stringify({
						animeName: data.info.title.romaji,
						animeId,
						providerId,
						watchId,
						episode,
						length: player.state.duration,
						time: player.currentTime
					})
				});
			}, 10000);
		});

		player.addEventListener('provider-change', (event) => {
			const provider = event.detail;

			if (provider?.type === 'hls') {
				// @ts-expect-error
				provider.library = HLS;
			}
		});

		player.addEventListener('error', (event) => {
			if ((event.detail.message = 'Failed to open media')) {
				useProxy();
			}
		});

		player.addEventListener('hls-error', (event) => {
			// @ts-expect-error
			if ((event.detail.details = 'manifestLoadError')) {
				useProxy();
			}
		});

		player.addEventListener('destroy', () => {
			clearInterval(interval);
		});

		function useProxy() {
			if (usingProxy) return;

			toast.error('Encountered CORS error, trying proxy');

			player.src = {
				src: `${PUBLIC_PROXY}m3u8-proxy?url=${encodeURIComponent(
					data.source.default!
				)}&headers=${encodeURIComponent(JSON.stringify(data.source.headers || {}))}`,
				type: 'application/x-mpegurl'
			};

			usingProxy = true;
		}

		// const currentEpisode: HTMLElement = document.getElementById($page.params.episode)!;

		// currentEpisode.scrollIntoView({
		// 	behavior: 'smooth'
		// });

		// messes up page transition, fix later?
	});
</script>

<section
	class="mx-auto min-h-screen max-w-screen-xl overflow-hidden rounded-b-lg bg-popover min-[1300px]:mb-10 min-[1300px]:border-x min-[1300px]:border-b"
>
	<media-player
		title={`${data.info.title.romaji} - Episode ${$page.params.episode}`}
		src={data.source.default}
		aspect-ratio="16/9"
		crossorigin
	>
		<media-outlet>
			{#each data.source.subtitles as subtitle}
				<track
					src={subtitle.url}
					kind="subtitles"
					label={subtitle.lang}
					default={subtitle.lang == 'English'}
					data-type="vtt"
				/>
			{/each}
		</media-outlet>
		<media-community-skin />
	</media-player>

	<div class="p-4 md:p-6">
		<div class="flex items-center justify-between">
			<div class="space-y-1">
				<a
					href="/{$page.params.animeId}"
					class="text-2xl font-semibold tracking-tight transition-colors hover:text-blue-400 md:text-3xl"
					>{data.info.title.romaji}</a
				>
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

		<div class="flex gap-2 overflow-x-auto">
			{#each data.episodes?.episodes as episode}
				<a
					data-sveltekit-reload
					href="/{$page.params.animeId}/{$page.params.providerId}/{encodeURIComponent(
						episode.id
					)}/{episode.number}{data.dubbed ? '/?subType=dub' : ''}"
					id={String(episode.number)}
					class={`rounded-sm ${
						episode.number == Number($page.params.episode)
							? 'bg-foreground text-background'
							: 'bg-muted'
					} mb-3 px-4 py-2 text-muted-foreground transition-all hover:bg-foreground hover:text-background dark:hover:bg-primary`}
				>
					{episode.number}
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	:root {
		--video-font-family: 'Inter var';
	}
</style>
