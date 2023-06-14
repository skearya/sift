<script lang="ts">
	import { cn } from "$lib/utils";

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<td
	class={cn("p-4 align-middle", className)}
	{...$$restProps}
>
	<slot />
</td>
