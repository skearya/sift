<script lang="ts">
	import type { PageData } from './$types';
	import { PUBLIC_PROXY } from '$env/static/public';
	import { onMount } from 'svelte';
	import HLS from 'hls.js';
	import { defineCustomElements } from 'vidstack/elements';
	import 'vidstack/styles/defaults.css';
	import 'vidstack/styles/community-skin/video.css';

	export let data: PageData;
	let src: string;

	for (const source of data.sources) {
		if (source.quality == 'default' || source.quality == 'auto') {
			src = `${PUBLIC_PROXY}m3u8-proxy?url=${encodeURIComponent(
				source.url
			)}&headers=${encodeURIComponent(JSON.stringify(data.headers || {}))}`;
		}
	}

	onMount(async () => {
		await defineCustomElements();

		const player = document.querySelector('media-player');

		player!.addEventListener('provider-change', (event) => {
			const provider = event.detail;

			if (provider?.type === 'hls') {
				// @ts-expect-error
				provider.library = HLS;
			}
		});
	});
</script>

<section class="mx-auto max-w-screen-2xl">
	<media-player {src} aspect-ratio="16/9" crossorigin type="application/x-mpegurl">
		<media-outlet />
		<media-community-skin />
	</media-player>
</section>

<style>
	:root {
		--video-font-family: 'Inter var';
	}
</style>
