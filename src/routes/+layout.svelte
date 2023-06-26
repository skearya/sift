<script lang="ts">
	import '../app.postcss';
	import type { LayoutData } from './$types';
	import { page, navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fly, slide } from 'svelte/transition';
	import { initFlash } from 'sveltekit-flash-message/client';
	import toast, { Toaster } from 'svelte-french-toast';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';
	import { Loader2 } from 'lucide-svelte';

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

{#if $navigating}
	<div
		transition:fly={{ x: -200 }}
		class="fixed left-8 top-24 z-50 rounded-lg bg-secondary p-3 shadow-lg border"
	>
		<Loader2 class="animate-spin" size="35" />
	</div>
{/if}

<nav
	class="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-primary-foreground px-6"
>
	<div class="flex items-center">
		<a href="/" class="mr-5">sift</a>
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

{#key data.url}
	<main in:fly={{ x: 200, duration: 300, delay: 300 }} out:fly={{ x: -200, duration: 300 }}>
		<slot />
	</main>
{/key}

<Toaster />

<style lang="postcss">
	:global(html) {
		scroll-behavior: smooth;
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
