<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import { format_timestamp } from '$lib/helpers/format';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<main class="flex flex-1 flex-col gap-4 p-4 md:p-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">
			{data.target.username}
		</h1>
		<a
			href="/admin/users"
			class="btn btn-ghost">Back to users</a
		>
	</div>

	{#if form?.error}
		<Alert message={form.error} />
	{:else if form?.message}
		<Alert
			kind="success"
			message={form.message}
		/>
	{/if}

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<div class="card border-base-content/10 bg-base-200 border">
			<div class="card-body gap-4">
				<h2 class="text-lg font-black tracking-tight md:text-xl">Account</h2>
				<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm md:text-base">
					<dt class="text-base-content/60">Email</dt>
					<dd class="break-all">{data.target.email}</dd>
					<dt class="text-base-content/60">Role</dt>
					<dd>
						<span class="badge {data.target.role === 'admin' ? 'badge-primary' : 'badge-ghost'}">
							{data.target.role}
						</span>
					</dd>
					<dt class="text-base-content/60">User ID</dt>
					<dd class="text-xs break-all md:text-sm">{data.target.user_id}</dd>
					<dt class="text-base-content/60">Created</dt>
					<dd>{format_timestamp(data.target.created_at)} UTC</dd>
					<dt class="text-base-content/60">Updated</dt>
					<dd>{format_timestamp(data.target.updated_at)} UTC</dd>
				</dl>
			</div>
		</div>

		<div class="card border-base-content/10 bg-base-200 border">
			<div class="card-body gap-4">
				<h2 class="text-lg font-black tracking-tight md:text-xl">Manage</h2>
				<form
					method="POST"
					action="?/rename"
					class="flex flex-col gap-1"
					use:enhance
				>
					<label
						class="label"
						for="username">Username</label
					>
					<div class="flex flex-col gap-2 sm:flex-row">
						<input
							id="username"
							name="username"
							class="input w-full"
							value={data.target.username}
							required
						/>
						<button class="btn btn-primary">Rename</button>
					</div>
				</form>
				<form
					method="POST"
					action="?/set_role"
					class="flex flex-col gap-1"
					use:enhance
				>
					<label
						class="label"
						for="role">Role</label
					>
					<div class="flex flex-col gap-2 sm:flex-row">
						<select
							id="role"
							name="role"
							class="select w-full"
							value={data.target.role}
						>
							<option value="user">user</option>
							<option value="admin">admin</option>
						</select>
						<button class="btn btn-primary">Set role</button>
					</div>
				</form>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<h2 class="text-lg font-black tracking-tight md:text-xl">Sessions</h2>
			{#if data.sessions.total > 0}
				<form
					method="POST"
					action="?/revoke_all_sessions"
					use:enhance
				>
					<button class="btn btn-outline btn-error btn-sm">Revoke all</button>
				</form>
			{/if}
		</div>
		{#if data.sessions.total === 0}
			<p class="text-base-content/60 text-sm md:text-base">No active sessions.</p>
		{:else}
			<div class="rounded-box border-base-content/10 bg-base-100 overflow-x-auto border">
				<table class="table">
					<thead>
						<tr>
							<th>Session</th>
							<th class="hidden md:table-cell">Created (UTC)</th>
							<th>Expires (UTC)</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each data.sessions.items as session (session.session_id)}
							<tr>
								<td class="text-xs whitespace-nowrap md:text-sm">
									{session.session_id.slice(0, 8)}&hellip;
									{#if session.session_id === data.current_session_id}
										<span class="badge badge-info badge-sm">current</span>
									{/if}
								</td>
								<td class="hidden text-xs whitespace-nowrap md:table-cell md:text-sm">
									{format_timestamp(session.created_at)}
								</td>
								<td class="text-xs whitespace-nowrap md:text-sm">
									{format_timestamp(session.expires_at)}
								</td>
								<td class="text-right">
									<form
										method="POST"
										action="?/revoke_session"
										use:enhance
									>
										<input
											type="hidden"
											name="session_id"
											value={session.session_id}
										/>
										<button class="btn btn-outline btn-error btn-sm">Revoke</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</main>
