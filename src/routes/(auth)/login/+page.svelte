<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, AlertDescription, AlertTitle } from '$components/ui/alert';
	import { Button } from '$components/ui/button';
	import { Input } from '$components/ui/input';
	import { Separator } from '$components/ui/separator';
	import { Lock } from 'lucide-svelte';
	import { Discord } from '$lib/icons';

	export let data;
</script>

<section class="flex h-[calc(100vh-65px)] w-full items-center justify-center gap-2">
	{#if !data.user}
		<form method="POST" use:enhance class="flex flex-col items-center gap-2">
			<h1 class="mb-4 text-3xl font-semibold tracking-tight">Log In</h1>
			<Input name="username" placeholder="username" />
			<Input type="password" name="password" placeholder="password" />
			<Button class="w-full">Sign In</Button>

			<Separator class="my-2" />

			<Button variant="outline" href="/oauth" class="w-full space-x-3">
				<div class="invert dark:invert-0">
					<Discord />
				</div>
				<h1>Discord</h1>
			</Button>

			<Button variant="link" href="/create">Create Account</Button>
		</form>
	{:else}
		<Alert class="w-min whitespace-nowrap" variant="destructive">
			<AlertTitle class="flex items-center gap-x-2"><Lock class="h-4 w-4" />Error</AlertTitle>
			<AlertDescription>Not (yet?) whitelisted!</AlertDescription>
		</Alert>
	{/if}
</section>
