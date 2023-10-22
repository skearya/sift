<script lang="ts">
	import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '$components/ui/card';
	import { Skeleton } from '$components/ui/skeleton';

	let classList =
		'flex flex-shrink-0 basis-[16rem] snap-start scroll-ml-8 flex-col first:ml-6 last:mr-6 lg:first:ml-8 lg:last:mr-8';

	export { classList as class };
</script>

<Card class={classList}>
	<CardHeader class="p-0">
		<Skeleton class="h-96 w-full rounded-none" />
	</CardHeader>
	<div class="space-y-1.5 p-6">
		<CardTitle>
			<Skeleton class="h-4 w-full" />
		</CardTitle>
		<CardDescription class="flex justify-between">
			<Skeleton class="h-4 w-1/3" />
		</CardDescription>
	</div>
	<CardFooter class="mt-auto flex-col gap-y-3">
		<Skeleton class="h-10 w-full" />
		<Skeleton class="h-10 w-full" />
	</CardFooter>
</Card>
