<script lang="ts">
	import Player from '$components/player/Player.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let src: string;

	for (const source of data.sources) {
		if (source.quality == 'default' || source.quality == 'auto') {
			src = source.url;
		}
	}
</script>

<section class="max-w-screen-2xl mx-auto">
	<Player {src} headers={data.headers} />
</section>
