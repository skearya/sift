<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { PUBLIC_PROXY } from '$env/static/public';
	import Player from '@oplayer/core';
	import ui from '@oplayer/ui';
	import hls from '@oplayer/hls';
	import toast from 'svelte-french-toast';

	export let data: PageData;
	let src: string;

	for (const source of data.sources) {
		if (source.quality == 'default' || source.quality == 'auto') {
			src = source.url;
		}
	}

	onMount(() => {
		const player = Player.make('#oplayer', {
			source: {
				src: src,
				poster: '',
				format: 'm3u8'
			}
		})
			.use([ui(), hls()])
			.create();

		player.on('error', (event) => {
			if (event.payload.details == 'manifestLoadError') {
				toast.error('Encountered CORS error, trying proxy. Switching providers is recommended.');

				player.changeSource({
					src: `${PUBLIC_PROXY}m3u8-proxy?url=${encodeURIComponent(
						src
					)}&headers=${encodeURIComponent(JSON.stringify(data.headers || {}))}`,
					format: 'm3u8'
				});
			}
		});
	});
</script>

<section class="mx-auto max-w-screen-2xl">
	<div id="oplayer" />
</section>

<style lang="postcss">
	:global(.css-1y41a61) {
		/* settings container */
		@apply rounded-xl;
	}

	:global(.css-vt2d99) {
		/* settings item */
		@apply rounded-lg px-3 py-6;
	}

	:global(.css-fy6n4p) {
		/* volume controls */
		@apply rounded-lg pt-1;
	}
</style>
