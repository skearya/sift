<script lang="ts">
	import '../app.postcss';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { initFlash } from 'sveltekit-flash-message/client';
	import toast, { Toaster } from 'svelte-french-toast';
	import { provider } from '$lib/provider';
	import { providers } from '$lib/api';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';
	import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '$components/ui/tooltip';

	export let data;

	const flash = initFlash(page);

	$: if ($flash) {
		switch ($flash.type) {
			case 'success':
				toast.success($flash.message);
				break;
			case 'error':
				toast.error($flash.message);
				break;
		}
	}

	let input: string;
</script>

<nav class="flex h-16 w-full items-center justify-between border-b bg-primary-foreground px-6">
	<div class="flex items-center">
		<a href="/" class="mr-5 font-bold">sift</a>

		<h1 class="mr-3">Provider:</h1>
		<div class="mr-3 rounded-md border">
			<select
				class="rounded-md border-r-8 border-r-transparent bg-transparent px-3 py-2"
				bind:value={$provider}
				on:change={() => {
					toast.success('Search again to apply the changes made to the provider.');
				}}
			>
				{#each providers as provider}
					<option value={provider}>{provider}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="flex items-center gap-x-4">
		<div class="flex items-center gap-x-6">
			<form
				on:submit|preventDefault={() => {
					goto(`/${$provider}/search?${new URLSearchParams({ query: input })}`);
				}}
			>
				<Input class="max-w-[200px]" placeholder="Search..." bind:value={input} />
			</form>
		</div>

		{#if data.user}
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Button href="/logout" variant="outline" class="flex h-10 items-center gap-x-3 px-3">
							<img
								class="rounded-full"
								src={`https://avatar.vercel.sh/${data.user.username}?size=25`}
								alt="pfp"
							/>
							<h1>{data.user?.username}</h1>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Log out</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
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
