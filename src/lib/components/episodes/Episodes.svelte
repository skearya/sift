<script lang="ts">
	import type { EpisodeData } from '$lib/types';
	import { api } from '$lib/api';
	import { navigating } from '$app/stores';
	import { toastState, animeId } from './stores';
	import { fade, slide } from 'svelte/transition';
	import { createDialog } from '@melt-ui/svelte';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$components/ui/tabs';
	import { flyAndScale, sleep } from '$lib/utils';
	import { Loader2, X } from 'lucide-svelte';

	const {
		elements: { portalled, overlay, content, title, close }
	} = createDialog({
		open: toastState
	});

	async function fetchEpisodes() {
		let response = await api(`episodes/${$animeId}`).json<EpisodeData[] & { message?: string }>();

		for (let i = 0; i < response.length; i++) {
			let firstItem = response[i].episodes[0].number;
			let lastItem = response[i].episodes[response[i].episodes.length - 1].number;

			if (firstItem > lastItem) {
				response[i].episodes.reverse();
			}
		}

		return response;
	}

	$: if ($navigating) toastState.set(false);
</script>

<div {...$portalled} use:portalled>
	{#if $toastState}
		<div
			transition:fade={{ duration: 150 }}
			{...$overlay}
			use:overlay
			class="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm"
		/>
		<div
			class="fixed left-[50%] top-[50%] z-30 grid max-h-[85vh] w-full translate-x-[-50%]
				translate-y-[-50%] gap-3 border-y bg-background p-5
				shadow-lg sm:w-[90vw] sm:max-w-[550px] sm:rounded-lg sm:border"
			in:flyAndScale={{ duration: 300, y: 20, start: 0.96 }}
			out:flyAndScale={{ duration: 300, y: 0, start: 0.96 }}
			{...$content}
			use:content
		>
			<h2 {...title} class="text-xl font-semibold leading-none tracking-tight">Episode Selector</h2>

			{#await fetchEpisodes()}
				<div class="flex w-full flex-wrap items-center justify-center gap-2">
					<Loader2 class="animate-spin" />

					{#await sleep(3000) then _}
						<h1 in:slide={{ axis: 'x' }} class="whitespace-nowrap text-muted-foreground">
							this can take a while..
						</h1>
					{/await}
				</div>
			{:then data}
				{#if data?.message}
					<h1 class="text-destructive">{data.message}</h1>
				{:else}
					<div class="flex flex-wrap gap-2" in:slide|global>
						<Tabs value={data[0]?.providerId} class="w-full" activateOnFocus={false}>
							<TabsList class={`mb-0 grid h-min w-full grid-cols-1 sm:grid-cols-${data.length}`}>
								{#each data as provider}
									<TabsTrigger value={provider.providerId}>{provider.providerId}</TabsTrigger>
								{:else}
									<div class="flex w-full items-center h-12 justify-center">
										<h1>No providers found</h1>
									</div>
								{/each}
							</TabsList>

							{#each data as provider}
								<TabsContent value={provider.providerId} class="mt-3 max-h-40 overflow-y-auto">
									<div class="mr-2 flex flex-wrap gap-2">
										{#each provider.episodes as episode}
											<a
												href={`/${$animeId}/${provider.providerId}/${encodeURIComponent(
													episode.id
												)}/${episode.number}`}
												class="rounded-md bg-muted px-4 py-2 transition-all hover:bg-foreground hover:text-background dark:hover:bg-primary"
											>
												{episode.number}
											</a>
										{:else}
											<div class="flex w-full justify-center">
												<h1>No episodes found</h1>
											</div>
										{/each}
									</div>
								</TabsContent>
							{/each}
						</Tabs>
					</div>
				{/if}
			{:catch}
				<h1 class="text-destructive">An error occurred</h1>
			{/await}

			<button
				{...close}
				use:close
				class="absolute right-[16px] top-[16px] inline-flex h-[30px] w-[30px] rounded-full
				text-muted-foreground transition-colors hover:text-foreground"
			>
				<X />
			</button>
		</div>
	{/if}
</div>
