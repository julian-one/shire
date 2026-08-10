<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<main class="flex flex-1 items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="card border-base-content/10 bg-base-200 border">
			<div class="card-body gap-4">
				<h1 class="text-3xl font-black tracking-tight md:text-4xl">Create user</h1>
				{#if form?.error}
					<Alert message={form.error} />
				{/if}
				<form
					method="POST"
					class="flex flex-col gap-4"
					use:enhance
				>
					<div class="flex flex-col gap-1">
						<label
							class="label"
							for="username">Username</label
						>
						<input
							id="username"
							name="username"
							class="input w-full"
							autocomplete="off"
							value={form?.username ?? ''}
							required
						/>
					</div>
					<div class="flex flex-col gap-1">
						<label
							class="label"
							for="email">Email</label
						>
						<input
							id="email"
							name="email"
							type="email"
							class="input w-full"
							autocomplete="off"
							value={form?.email ?? ''}
							required
						/>
					</div>
					<div class="flex flex-col gap-1">
						<label
							class="label"
							for="password">Password</label
						>
						<input
							id="password"
							name="password"
							type="password"
							class="input w-full"
							autocomplete="new-password"
							required
						/>
					</div>
					<div class="flex flex-col gap-1">
						<label
							class="label"
							for="role">Role</label
						>
						<select
							id="role"
							name="role"
							class="select w-full"
							value={form?.role ?? 'user'}
						>
							<option value="user">user</option>
							<option value="admin">admin</option>
						</select>
					</div>
					<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
						<a
							href="/admin/users"
							class="btn btn-ghost">Cancel</a
						>
						<button class="btn btn-primary">Create user</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</main>
