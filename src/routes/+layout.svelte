<script lang="ts">
	import '../app.postcss';
	import type { LayoutData } from './$types';
	import { page, navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fly, slide, scale } from 'svelte/transition';
	import { getFlash } from 'sveltekit-flash-message/client';
	import toast, { Toaster } from 'svelte-french-toast';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';
	import { Toggle } from '$components/ui/toggle';
	import { Episodes } from '$components/episodes';
	import { LightSwitch } from '$components/light-switch';
	import { setInitialClassState } from '$components/light-switch/light-switch';
	import { ChevronDown, Github, Loader2 } from 'lucide-svelte';

	export let data: LayoutData;

	const flash = getFlash(page);

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
	let dropdown: boolean;

	$: if ($navigating) dropdown = false;

	let mocha: number = 0;
</script>

<svelte:head>
	{@html `<script nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();</script>`}
</svelte:head>

{#if $navigating}
	<div
		transition:fly={{ x: -200 }}
		class="fixed left-8 top-24 z-50 rounded-lg border bg-secondary p-3 shadow-lg"
	>
		<Loader2 class="animate-spin" size="35" />
	</div>
{/if}

<nav class="sticky top-0 z-40 flex w-full flex-col border-b bg-primary-foreground px-6">
	<div class="flex h-16 items-center justify-between">
		<div class="flex items-center">
			<a
				href="/"
				class="mr-5"
				on:click={() => {
					mocha++;

					if (mocha > 20) {
						let textNodes = document.getElementsByTagName('h1');

						for (var i = 0; i < textNodes.length; i++) {
							textNodes[i].textContent = 'mochalinky';
						}

						let imgNodes = document.getElementsByTagName('img');

						for (var i = 0; i < imgNodes.length; i++) {
							imgNodes[i].src =
								'https://cdn.discordapp.com/avatars/254415959505240064/d86672c399eda0eee0269a289f8db065.webp?size=64';
						}
					}
				}}>sift</a
			>
		</div>

		<div class="flex items-center gap-x-3">
			{#if data.user}
				<div>
					<form
						on:submit|preventDefault={() => {
							goto(`/search?${new URLSearchParams({ query: input })}`);
						}}
						class="hidden sm:flex"
					>
						<Input class="max-w-[200px]" placeholder="Search..." bind:value={input} />
					</form>

					<Toggle
						bind:pressed={dropdown}
						on:click={() => (dropdown = !dropdown)}
						class="block cursor-pointer p-2 sm:hidden"
					>
						<ChevronDown
							class={`transition-transform duration-300 ${dropdown ? 'rotate-180' : ''}`}
						/>
					</Toggle>
				</div>

				<Button href="/logout" variant="outline" class="flex h-10 items-center gap-x-3 px-3">
					<img
						class="h-7 w-7 rounded-full"
						src={`https://avatar.vercel.sh/${data.user.username}?size=50`}
						alt="pfp"
					/>
					<h1 class="max-w-[150px] overflow-hidden text-ellipsis">{data.user?.username}</h1>
				</Button>
			{/if}

			<LightSwitch />
		</div>
	</div>
	{#if dropdown}
		<form
			transition:slide
			on:submit|preventDefault={() => {
				goto(`/search?${new URLSearchParams({ query: input })}`);
			}}
			class="mb-3 block sm:hidden"
		>
			<div transition:scale>
				<Input placeholder="Search..." bind:value={input} />
			</div>
		</form>
	{/if}
</nav>

{#key data.url}
	<main in:fly={{ x: -10, duration: 500, delay: 500 }} out:fly={{ x: 5, duration: 500 }}>
		<slot />
	</main>
{/key}

<footer class="w-full border-t">
	<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-16">
		<div class="flex flex-col items-baseline space-y-4">
			<div class="mx-auto">
				<a href="https://github.com/skearya/sift" target="_blank" class="text-md mx-auto">
					<Github />
				</a>
			</div>
			<div class="mx-auto">
				<span class="mx-auto mt-2 text-sm text-muted-foreground">
					Powered by
					<a
						href="https://docs.anify.tv"
						target="_blank"
						class="mx-0 text-blue-400 hover:text-gray-500"
					>
						Anify
					</a>
				</span>
			</div>
		</div>
	</div>
</footer>

<Episodes />

<Toaster
	toastOptions={{
		style:
			'border-width: 1px; background-color: hsl(var(--background)); color: hsl(var(--foreground));'
	}}
/>

<style lang="postcss">
	:global(html) {
		scroll-behavior: smooth;
		font-family: 'Inter var', sans-serif;
		overflow-y: overlay;
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
