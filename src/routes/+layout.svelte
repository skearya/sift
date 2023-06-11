<script lang="ts">
	import '../app.postcss';
	import { Input } from '$components/ui/input';
	import { provider } from '$lib/provider';
	import { providers } from '$lib/api';
	import { goto } from '$app/navigation';
	import { Toaster } from 'svelte-french-toast';

	let input: string;
</script>

<nav class="flex h-16 w-full items-center justify-between border-b bg-primary-foreground px-6">
	<div class="flex items-center">
		<a href="/" class="mr-5 font-bold">21</a>

		<h1 class="mr-3">Provider:</h1>
		<div class="rounded-md border mr-3">
			<select
				class="rounded-md border-r-8 border-r-transparent bg-transparent px-3 py-2"
				bind:value={$provider}
			>
				{#each providers as provider}
					<option value={provider}>{provider}</option>
				{/each}
			</select>
		</div>
	</div>

	<div>
		<div class="flex items-center gap-x-6">
			<form
				on:submit|preventDefault={() => {
					goto(`/${$provider}/search?${new URLSearchParams({ query: input })}`);
				}}
			>
				<Input class="max-w-[200px]" placeholder="Search..." bind:value={input} />
			</form>
		</div>
	</div>
</nav>

<slot />

<Toaster />

<style lang="postcss">
	@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');

	:global(body) {
		font-family: 'Inter var', sans-serif;
	}

	@font-face {
		font-family: 'Inter var';
		font-weight: 100 900;
		font-display: swap;
		font-style: normal;
		font-named-instance: 'Regular';
		src: url('/Inter-roman.var.woff2') format('woff2');
	}
</style>
