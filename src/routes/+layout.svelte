<script lang="ts">
	import '../app.postcss';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { initFlash } from 'sveltekit-flash-message/client';
	import toast, { Toaster } from 'svelte-french-toast';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';

	export let data: LayoutData;

	const flash = initFlash(page);

	flash.subscribe(($flash) => {
		if (!$flash) return;

		switch ($flash.type) {
			case 'success':
				toast.success($flash.message);
				break;
			case 'error':
				toast.error($flash.message);
				break;
		}

		flash.set(undefined);
	});

	let input: string;
</script>

<nav class="flex h-16 w-full items-center justify-between border-b bg-primary-foreground px-6">
	<div class="flex items-center">
		<a href="/" class="mr-5 font-bold">sift</a>
	</div>

	<div class="flex items-center gap-x-4">
		<div class="flex items-center gap-x-6">
			<form
				on:submit|preventDefault={() => {
					goto(`/search?${new URLSearchParams({ query: input })}`);
				}}
			>
				<Input class="max-w-[200px]" placeholder="Search..." bind:value={input} />
			</form>
		</div>

		{#if data.user}
			<Button href="/logout" variant="outline" class="flex h-10 items-center gap-x-3 px-3">
				<img
					class="rounded-full"
					src={`https://avatar.vercel.sh/${data.user.username}?size=25`}
					alt="pfp"
				/>
				<h1>{data.user?.username}</h1>
			</Button>
		{/if}
	</div>
</nav>

<slot />

<Toaster />

<style lang="postcss">
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
