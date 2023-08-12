<script lang="ts">
	import type { EpisodeData } from '$lib/types';
	import { navigating } from '$app/stores';
	import { toastState, animeId } from './stores';
	import { fade, slide, type TransitionConfig } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { createDialog } from '@melt-ui/svelte';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$components/ui/tabs';
	import { Loader2, X } from 'lucide-svelte';
	import ky from 'ky-universal';

	let longLoading: boolean = false;
	let timeout: ReturnType<typeof setInterval>;

	const { portal, overlay, content, title, close, open } = createDialog({ preventScroll: false });

	async function fetchEpisodes() {
		longLoading = false;

		let response = await ky(`/api/episodes/${$animeId}`, {
			hooks: {
				beforeRequest: [
					() => {
						timeout = setTimeout(() => (longLoading = true), 3000);
					}
				],
				afterResponse: [
					() => {
						clearTimeout(timeout);
						longLoading = false;
					}
				]
			}
		}).json<EpisodeData[] & { message?: string }>();

		for (let i = 0; i < response.length; i++) {
			let firstItem = response[i].episodes[0].number;
			let lastItem = response[i].episodes[response[i].episodes.length - 1].number;

			if (firstItem > lastItem) {
				response[i].episodes.reverse();
			}
		}

		return response;
	}

	$: if ($navigating) open.set(false);

	$: $toastState = $open;

	toastState.subscribe((value) => {
		open.set(value);
	});

	// https://github.com/melt-ui/melt-ui/blob/388d8fe4282c1b7fb1b0359482fc184169fd872e/src/routes/helpers.ts#L101

	type FlyAndScaleOptions = {
		y: number;
		start: number;
		duration?: number;
	};

	const flyAndScale = (node: HTMLElement, options: FlyAndScaleOptions): TransitionConfig => {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: options.duration ?? 150,
			delay: 0,
			css: (t) => {
				const y = scaleConversion(t, [0, 1], [options.y, 0]);
				const scale = scaleConversion(t, [0, 1], [options.start, 1]);

				return styleToString({
					transform: `${transform} translate3d(0, ${y}px, 0) scale(${scale})`,
					opacity: t
				});
			},
			easing: cubicOut
		};
	};

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	function styleToString(style: Record<string, number | string | undefined>): string {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	}
</script>

<div use:portal>
	{#if $open}
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
				<div class="-mb-10 mt-2 flex w-full flex-wrap items-center justify-center gap-2">
					<Loader2 class="animate-spin" />
					{#if longLoading}
						<h1 in:slide={{ axis: 'x' }} class="whitespace-nowrap text-muted-foreground">
							this can take a while..
						</h1>
					{/if}
				</div>

				<div class="mt-[25px]" />
			{:then data}
				{#if data?.message}
					<h1 class="text-destructive">{data.message}</h1>
				{:else}
					<div class="mt-2 flex flex-wrap gap-2" in:slide|global>
						<Tabs value={data[0]?.providerId} class="w-full" activateOn={'click'}>
							<TabsList class={`mb-0 grid w-full grid-cols-1 sm:grid-cols-${data.length}`}>
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
				class="absolute right-[19px] top-[19px] inline-flex h-[30px] w-[30px] rounded-full
				text-muted-foreground transition-colors hover:text-foreground"
			>
				<X />
			</button>
		</div>
	{/if}
</div>
