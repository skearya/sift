<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$components/ui/button';
	import { Input } from '$components/ui/input';
	import { Separator } from '$components/ui/separator';
	import { Discord } from '$lib/icons';
</script>

<section class="flex h-[calc(100vh-65px)] w-full items-center justify-center gap-2">
	<form method="POST" use:enhance class="flex flex-col items-center gap-2">
		<h1 class="mb-4 text-3xl font-semibold tracking-tight">Create Account</h1>
		<Input name="username" placeholder="username" />
		<Input type="password" name="password" placeholder="password" />
		<Button class="w-full">Create</Button>

		<Separator class="my-2" />

		<Button variant="outline" href="/oauth" class="w-full space-x-3">
			<div class="invert dark:invert-0">
				<Discord />
			</div>
			<h1>Discord</h1>
		</Button>

		<Button variant="link" href="/login">Sign In</Button>
	</form>
</section>
