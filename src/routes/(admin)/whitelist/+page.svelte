<script lang="ts">
	import type { PageData } from './$types';
	import {
		Table,
		TableBody,
		TableCaption,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$components/ui/table';
	import { enhance } from '$app/forms';

	export let data: PageData;
</script>

<section class="container my-8 px-6 lg:px-8">
	<h1 class="mb-5 text-2xl font-semibold tracking-tight lg:text-3xl">Users</h1>

	<Table class="border">
		<TableCaption>
			Total Users: {data.users.length} | Authorized Users: {data.users.filter((user) =>
				user.authorized ? true : false
			).length}</TableCaption
		>
		<TableHeader>
			<TableRow>
				<TableHead>Username</TableHead>
				<TableHead class="text-right">Authorized</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.users as user, i (i)}
				<TableRow>
					<TableCell>{user.username}</TableCell>
					<TableCell>
						<form
							use:enhance
							id={user.id}
							method="POST"
							class="mt-[2px] flex items-end justify-end"
						>
							<input name="id" type="hidden" class="hidden" hidden value={user.id} />
							<input name="discordId" type="hidden" class="hidden" hidden value={user.discordId} />
							<input name="username" type="hidden" class="hidden" hidden value={user.username} />
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
