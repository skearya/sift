<script lang="ts">
	import '../app.postcss';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import { page, navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getFlash } from 'sveltekit-flash-message/client';
	import { sleep } from '$lib/utils';
	import { preferences } from '$lib/settings';
	import { fly, slide, scale } from 'svelte/transition';
	import toast, { Toaster } from 'svelte-french-toast';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$components/ui/select';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import { Input } from '$components/ui/input';
	import { Toggle } from '$components/ui/toggle';
	import { Switch } from '$components/ui/switch';
	import { Button } from '$components/ui/button';
	import { Separator } from '$components/ui/separator';
	import { Episodes } from '$components/episodes';
	import { ChevronDown, Github, History, Loader2, LogOut, Settings } from 'lucide-svelte';
	import {
		getModeOsPrefers,
		modeCurrent,
		setModeCurrent,
		setModeUserPrefers,
		setInitialClassState
	} from '$components/light-switch/light-switch';

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

	let input: string = '';
	let dropdown: boolean = false;
	let resetClickCount = 0;
	let selected = {
		value: $preferences.type,
		label: $preferences.type.charAt(0).toUpperCase() + $preferences.type.slice(1)
	};

	onMount(() => {
		if (!('modeCurrent' in localStorage)) {
			setModeCurrent(getModeOsPrefers());
		}

		modeCurrent.subscribe((mode) => {
			setModeUserPrefers(mode);
			setModeCurrent(mode);
		});
	});

	function search() {
		if (input !== '') {
			goto(`/search?${new URLSearchParams({ query: input })}`);
		}
	}

	$: if ($navigating) dropdown = false;
	$: $preferences.type = selected.value as 'romaji' | 'native' | 'english';
</script>

<svelte:head>
	{@html `<script nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();</script>`}
	<title>sift</title>
</svelte:head>

{#if $navigating}
	<div
		transition:fly={{ x: -200 }}
		class="fixed left-6 top-24 z-50 flex flex-wrap items-center gap-x-2 rounded-lg border bg-secondary p-3 shadow-lg"
	>
		<Loader2 class="animate-spin" size="35" />

		{#await sleep(3000) then _}
			<h1 in:slide={{ axis: 'x' }} class="whitespace-nowrap">this can take a while..</h1>
		{/await}
	</div>
{/if}

<nav class="fixed top-0 z-40 flex w-full select-none flex-col border-b bg-primary-foreground px-6">
	<div class="flex h-16 items-center justify-between">
		<div class="flex items-center">
			<a href="/" class="mr-5">sift</a>
		</div>

		<div class="flex gap-x-2">
			<form on:submit|preventDefault={search} class="hidden sm:flex">
				<Input class="max-w-[200px]" placeholder="Search..." bind:value={input} />
			</form>

			{#if data.user}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							variant="outline"
							class="flex h-10 items-center gap-x-3 px-3"
						>
							<img
								class="h-7 w-7 rounded-full"
								src={`https://avatar.vercel.sh/${data.user.username}?size=56`}
								alt="pfp"
							/>
							<h1 class="max-w-[150px] overflow-hidden text-ellipsis">{data.user?.username}</h1>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56 text-white">
						<DropdownMenu.Label>My Account</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item on:click={() => goto('/history')}>
							<History class="mr-2 h-4 w-4" />
							<span>Watch History</span>
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item on:click={() => goto('/logout')}>
							<LogOut class="mr-2 h-4 w-4" />
							<span>Log out</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}

			<Toggle
				bind:pressed={dropdown}
				on:click={() => (dropdown = !dropdown)}
				class="block cursor-pointer p-2 sm:hidden"
			>
				<ChevronDown class={`transition-transform duration-300 ${dropdown ? 'rotate-180' : ''}`} />
			</Toggle>

			<Dialog.Root>
				<Dialog.Trigger
					on:click={() => (resetClickCount = 0)}
					class="rounded-md p-2 transition-colors hover:bg-accent"
				>
					<Settings strokeWidth="1.5" />
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title class="text-xl">Settings</Dialog.Title>
					</Dialog.Header>

					<div class="flex flex-col gap-y-3">
						<div class="flex items-center justify-between">
							<h1>Light Mode</h1>
							<Switch bind:checked={$modeCurrent} />
						</div>

						<Separator />

						<div class="flex items-center justify-between">
							<h1>Name Type</h1>

							<Select.Root bind:selected>
								<Select.Trigger class="w-[150px]">
									<Select.Value placeholder="Select a type" />
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each ['romaji', 'native', 'english'] as type}
											<Select.Item
												value={type}
												label={type.charAt(0).toUpperCase() + type.slice(1)}
												class="text-white"
											>
												{type.charAt(0).toUpperCase() + type.slice(1)}
											</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</div>

						<Separator />

						<div class="flex items-center justify-between">
							<h1>Reset Everything</h1>
							<Button
								variant="destructive"
								on:click={() => {
									resetClickCount += 1;
									if (resetClickCount >= 2) {
										localStorage.clear();
										location.reload();
									}
								}}
							>
								{resetClickCount >= 1 ? "I'm really sure!" : "I'm sure!"}
							</Button>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>

	{#if dropdown}
		<form transition:slide on:submit|preventDefault={search} class="mb-3 block sm:hidden">
			<div transition:scale>
				<Input placeholder="Search..." bind:value={input} />
			</div>
		</form>
	{/if}
</nav>

{#key data.url}
	<main
		in:fly={{ x: -10, duration: 500, delay: 500 }}
		out:fly={{ x: 5, duration: 500 }}
		class="pt-16"
	>
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
					|
					<a href="/dmca" class="text-blue-400 hover:text-gray-500">DMCA</a>
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
