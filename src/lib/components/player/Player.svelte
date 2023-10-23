<script lang="ts">
	import type { Headers } from '$lib/types';
	import type { MediaPlayerElement } from 'vidstack/elements';
	import type {
		HLSErrorEvent,
		HLSProvider,
		MediaCanPlayEvent,
		MediaErrorEvent,
		MediaProviderChangeEvent,
		MediaVolumeChangeEvent
	} from 'vidstack';
	import { PUBLIC_PROXY } from '$env/static/public';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import toast from 'svelte-french-toast';
	import Hls from 'hls.js';
	import 'vidstack/player/styles/default/theme.css';
	import 'vidstack/player/styles/default/layouts/audio.css';
	import 'vidstack/player/styles/default/layouts/video.css';
	import 'vidstack/player';
	import 'vidstack/player/layouts';
	import 'vidstack/player/ui';

	export let src: string;
	export let time: string | null;
	export let headers: Headers;
	export let title: string;
	export let subtitles: any[];

	let player: MediaPlayerElement;
	let interval: ReturnType<typeof setInterval>;
	let usingProxy: boolean = false;

	onMount(() => {
		if (time) player.currentTime = Number(time);
		if (localStorage.getItem('volume') !== null) {
			player.volume = Number(localStorage.getItem('volume'));
		}
	});

	onDestroy(() => {
		player.destroy();
		clearInterval(interval);
	});

	function onCanPlay(_event: MediaCanPlayEvent) {
		interval = setInterval(() => {
			if (!player.state.playing) return;

			const { animeId, providerId, watchId, episode } = $page.params;

			fetch('/api/history', {
				method: 'POST',
				body: JSON.stringify({
					animeName: title,
					animeId,
					providerId,
					watchId,
					episode,
					length: player.state.duration,
					time: player.currentTime
				})
			});
		}, 10000);
	}

	function onVolumeChange(event: MediaVolumeChangeEvent) {
		localStorage.setItem('volume', event.detail.volume.toString());
	}

	function onProviderChange(event: MediaProviderChangeEvent) {
		const provider = event.detail;

		if (provider?.type === 'hls') {
			(provider as HLSProvider).library = Hls;
		}
	}

	function onError(event: MediaErrorEvent) {
		if ((event.detail.message = 'Failed to open media')) useProxy();
	}

	function onHlsError(event: HLSErrorEvent) {
		if (event.detail.fatal) useProxy();
	}

	function useProxy() {
		if (usingProxy) return;
		usingProxy = true;

		toast.error('Encountered CORS error, trying proxy');

		let currentTime = player.currentTime || Number(time);

		player.src = {
			src: `${PUBLIC_PROXY}m3u8-proxy?url=${encodeURIComponent(src)}&headers=${encodeURIComponent(
				JSON.stringify(headers || {})
			)}`,
			type: 'application/x-mpegurl'
		};

		if (player.currentTime == 0) return;

		player.addEventListener(
			'can-play',
			async () => {
				player.currentTime = currentTime;
				await player.play();
			},
			{ once: true }
		);
	}
</script>

<media-player
	class="aspect-video"
	{src}
	title={`${title} - Episode ${$page.params.episode}`}
	crossorigin
	on:can-play={onCanPlay}
	on:volume-change={onVolumeChange}
	on:error={onError}
	on:hls-error={onHlsError}
	on:provider-change={onProviderChange}
	bind:this={player}
>
	<media-provider>
		{#each subtitles as subtitle}
			<track
				src={subtitle.url}
				kind="subtitles"
				label={subtitle.lang}
				default={subtitle.lang == 'English'}
				data-type="vtt"
			/>
		{/each}
	</media-provider>
	<media-video-layout />
</media-player>
