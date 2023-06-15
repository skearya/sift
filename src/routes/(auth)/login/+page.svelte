<script lang="ts">
	import { Alert, AlertDescription, AlertTitle } from '$components/ui/alert';
	import { Button } from '$components/ui/button';
	import { Lock } from 'lucide-svelte';

	export let data;
</script>

<div class="flex h-[calc(100vh-64px)] w-full items-center justify-center gap-2">
	{#if !data.user}
		<Button size="lg" href="/oauth" type="submit">Log in</Button>
	{:else}
		<Alert class="w-min whitespace-nowrap" variant="destructive">
			<AlertTitle class="flex gap-x-2 items-center"><Lock class="h-4 w-4" />Error</AlertTitle>
			<AlertDescription>Not authorized!</AlertDescription>
		</Alert>
	{/if}
</div>
