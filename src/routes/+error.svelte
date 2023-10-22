<script lang="ts">
	import { page as pageStore } from '$app/stores';
	import { animeId as animeIdStore, toastState } from '$components/episodes';
	import { Button } from '$components/ui/button';
	import { Separator } from '$components/ui/separator';
	import { get } from 'svelte/store';

	let page = get(pageStore);
	let { animeId, providerId, watchId, episode } = page.params;
</script>

<section class="container flex h-[calc(100vh-65px)] items-center justify-center">
	<div class="rounded-lg border border-destructive p-4">
		<h1 class="text-4xl">{page.status}</h1>
		<h1 class="text-lg">{page.error?.message || 'An error occurred'}</h1>

		{#if animeId && providerId && watchId && episode}
			<Button
				on:click={() => {
					animeIdStore.set(Number(animeId));
					toastState.set(true);
				}}
				class="my-2 w-full"
				variant="secondary"
			>
				Try Alternative Provider
			</Button>
		{/if}

		{#if page.error?.info}
			<Separator class="my-2" />
			<h1 class="">More Info:</h1>
			<pre class="whitespace-normal">{page.error?.info}</pre>
		{/if}
	</div>
</section>
