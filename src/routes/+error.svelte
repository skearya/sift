<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1>{$page.status}: {$page.error?.message}</h1>
<h1>something pretty bad just happened, try another provider</h1>
<img
	src="https://cdn.discordapp.com/emojis/1068123907829280788.webp?size=240&quality=lossless"
	alt="thinking"
/>
