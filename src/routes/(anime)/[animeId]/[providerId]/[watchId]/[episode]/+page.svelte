<script lang="ts">
	import type { PageData } from './$types';
	import { PUBLIC_PROXY } from '$env/static/public';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import HLS from 'hls.js';
	import { defineCustomElements } from 'vidstack/elements';
	import 'vidstack/styles/defaults.css';
	import 'vidstack/styles/community-skin/video.css';

	export let data: PageData;
	let src: string;
	let usingProxy: boolean = false;

	for (const source of data.sources) {
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
					)}&headers=${encodeURIComponent(JSON.stringify(data.headers || {}))}`,
					type: 'application/x-mpegurl'
				};

				usingProxy = true;
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
