<script lang="ts">
	export let src: string;
	export let headers: object | undefined;

	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import Player from '@oplayer/core';
	import ui from '@oplayer/ui';
	import hls from '@oplayer/hls';
	import '$lib/components/player/player.postcss';

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
					src: `https://m3u8-proxy-ixam.onrender.com/m3u8-proxy?url=${encodeURIComponent(
						src
					)}&headers=${encodeURIComponent(JSON.stringify(headers || {}))}`,
					format: 'm3u8'
				});
			}
		});
	});
</script>

<div id="oplayer" />
