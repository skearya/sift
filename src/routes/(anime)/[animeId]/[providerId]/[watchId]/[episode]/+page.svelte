<script lang="ts">
	import type { PageData } from './$types';
	import type { HLSProvider } from 'vidstack';
	import { PUBLIC_PROXY } from '$env/static/public';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { bestFallback } from '$lib/api';
	import toast from 'svelte-french-toast';
	import { Button } from '$components/ui/button';
	import HLS from 'hls.js';
	import { defineCustomElements } from 'vidstack/elements';
	import 'vidstack/styles/defaults.css';
	import 'vidstack/styles/community-skin/video.css';
	import { AniList, Kitsu, Simkl } from '$lib/icons';
	import { Play } from 'lucide-svelte';

	export let data: PageData;
	let interval: ReturnType<typeof setInterval>;
	let usingProxy: boolean = false;

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
				(provider as HLSProvider).library = HLS;
			}
		});

		player.addEventListener('error', (event) => {
			if ((event.detail.message = 'Failed to open media')) useProxy();
		});

		player.addEventListener('hls-error', (event) => {
			if (event.detail.fatal) useProxy();
		});

		player.addEventListener('destroy', () => {
			clearInterval(interval);
		});

		function useProxy() {
			if (usingProxy) return;

			usingProxy = true;

			toast.error('Encountered CORS error, trying proxy');

			let time = player.currentTime || Number(data.time);

			player.src = {
				src: `${PUBLIC_PROXY}m3u8-proxy?url=${encodeURIComponent(
					data.source.default!
				)}&headers=${encodeURIComponent(JSON.stringify(data.source.headers || {}))}`,
				type: 'application/x-mpegurl'
			};

			if (player.currentTime == 0) return;

			player.addEventListener(
				'can-play',
				async () => {
					player.currentTime = time;
					await player.play();
				},
				{ once: true }
			);
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
		<div class="space-y-1">
			<h1 class="text-2xl font-semibold tracking-tight md:text-3xl">
				{data.info.title.romaji}
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
					data-sveltekit-reload
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
						data-sveltekit-reload
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
					data-sveltekit-reload
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
