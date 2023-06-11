<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$components/ui/button';
	import { Input } from '$components/ui/input';
</script>

<form
	use:enhance
	method="post"
	class="flex h-[calc(100vh-64px)] w-full items-center justify-center"
>
	<Input class="w-72" name="password" placeholder="password" />
	<Button type="submit">Log in</Button>
</form>
