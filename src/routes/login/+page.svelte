<script lang="ts">
	import { Button } from '$components/ui/button';

	export let data;
</script>

<div class="flex h-[calc(100vh-64px)] w-full items-center justify-center gap-2">
	{#if !data.user}
		<Button size="lg" href="/oauth" type="submit">Log in</Button>
	{:else}
		<code>authorized: {data.user.authorized}</code>
	{/if}
</div>
