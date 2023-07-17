<script lang="ts">
	import { page } from '$app/stores';
	import { Separator } from '$components/ui/separator';
</script>

<section class="container flex h-[calc(100vh-65px)] items-center justify-center">
	<div class="rounded-lg bg-destructive p-4">
		<h1 class="font-mono text-3xl">{$page.status}</h1>
		<h1 class="text-lg">{$page.error?.message || 'An error occurred'}</h1>

		{#if $page.error?.info}
			<Separator class="my-2 bg-destructive-foreground" />
			<pre class="whitespace-normal">{$page.error?.info}</pre>
		{/if}
	</div>
</section>
