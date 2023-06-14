<script lang="ts">
	import type { PageData } from './$types';

	import { Separator } from '$components/ui/separator';
	import {
		Table,
		TableBody,
		TableCaption,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$components/ui/table';

	export let data: PageData;
</script>

<section class="container">
	<h1 class="mb-3 mt-6 text-3xl font-semibold">Users</h1>

	<Separator class="my-6" />

	<Table class="border">
		<TableCaption
			>Total Users: {data.users.length} | Authorized Users: {data.users.filter((user) =>
				user.authorized ? true : false
			).length}</TableCaption
		>
		<TableHeader>
			<TableRow>
				<TableHead class="w-[100px]">User</TableHead>
				<TableHead>Discord ID</TableHead>
				<TableHead>Username</TableHead>
				<TableHead class="text-right">Authorized</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.users as user, i (i)}
				<TableRow key={user.id}>
					<TableCell class="font-medium">{i + 1}</TableCell>
					<TableCell>{user.discordId}</TableCell>
					<TableCell>{user.username}</TableCell>
					<TableCell>
						<form id={user.id} method="POST" class="mt-[2px] flex items-end justify-end">
							<input name="id" type="hidden" class="hidden" hidden value={user.id} />
							<input
								name="authorized"
								type="hidden"
								class="hidden"
								hidden
								value={user.authorized}
							/>
							<input
								type="checkbox"
								bind:checked={user.authorized}
								on:change={() => {
									// @ts-expect-error
									document.getElementById(user.id).requestSubmit();
								}}
							/>
						</form>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</section>
