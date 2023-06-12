<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { Badge } from '$components/ui/badge';
	import { Separator } from '$components/ui/separator';
	import { Alert, AlertTitle, AlertDescription } from '$components/ui/alert';
	import { AlertCircle } from 'lucide-svelte';

	export let data: PageData;
</script>

<section class="container my-10 space-y-10">
	<div class="flex flex-col items-center gap-8 md:flex-row md:items-start">
		<div id="imgContainer" class="max-w-[15rem] flex-shrink-0 md:max-w-[20rem] lg:max-w-sm">
			<img id="img" src={data.image} alt="anime cover" class="rounded-md object-cover shadow" />
		</div>
		<div class="space-y-3">
			<h1 class="text-4xl font-semibold">{data.title}</h1>
			{#if data.season && data.releaseDate}
				<h1 class="text-muted-foreground">{data.season} {data.releaseDate}</h1>
			{/if}
			{#if data.genres}
				<div class="flex flex-wrap gap-2">
					{#each data.genres || [] as genre}
						<Badge variant="secondary">{genre}</Badge>
					{/each}
				</div>
			{/if}
			<div>{@html data.description}</div>
		</div>
	</div>

	<div>
		<h1 class="text-4xl font-semibold">Episodes</h1>

		<button
			on:click={() => window.scrollTo(0, document.body.scrollHeight)}
			class="mt-2 text-muted-foreground">scroll to bottom</button
		>

		<Separator class="my-6" />

		<div class="flex flex-col justify-center gap-4">
			{#each data.episodes as episode}
				<a
					href={`/${$page.params.provider}/watch/${episode.id}`}
					class="flex h-min w-full items-stretch overflow-hidden rounded-md border"
				>
					<div class="m-2 flex items-center justify-center rounded-md bg-secondary px-3">
						<h1 class="font-semibold">{episode.number}</h1>
					</div>
					<div class="flex-grow bg-transparent px-2 py-4">
						<h1 class="font-medium">{episode.title || episode.id}</h1>
					</div>
				</a>
			{:else}
				<Alert variant="destructive">
					<AlertTitle class="flex gap-x-2"
						><AlertCircle class="h-4 w-4" />No episodes found</AlertTitle
					>
					<AlertDescription>Please try another provider.</AlertDescription>
				</Alert>
			{/each}
		</div>

		<button
			on:click={() => window.scrollTo({ top: 0 })}
			class="mt-4 text-muted-foreground">scroll to top</button
		>
	</div>
</section>
