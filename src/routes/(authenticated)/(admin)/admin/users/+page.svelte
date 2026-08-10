<script lang="ts">
	import { format_timestamp } from '$lib/helpers/format';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<main class="flex flex-1 flex-col gap-4 p-4 md:p-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">Users</h1>
		<a
			href="/admin/users/create"
			class="btn btn-primary">Create user</a
		>
	</div>
	<div class="rounded-box border-base-content/10 bg-base-100 overflow-x-auto border">
		<table class="table">
			<thead>
				<tr>
					<th>Username</th>
					<th class="hidden md:table-cell">Email</th>
					<th>Role</th>
					<th class="hidden lg:table-cell">Created (UTC)</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users.items as user (user.user_id)}
					<tr>
						<td>
							<a
								href="/admin/users/{user.user_id}"
								class="link">{user.username}</a
							>
						</td>
						<td class="hidden md:table-cell">{user.email}</td>
						<td>
							<span class="badge {user.role === 'admin' ? 'badge-primary' : 'badge-ghost'}">
								{user.role}
							</span>
						</td>
						<td class="hidden text-xs whitespace-nowrap md:text-sm lg:table-cell">
							{format_timestamp(user.created_at)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p class="text-base-content/60 text-sm md:text-base">{data.users.total} total</p>
</main>
