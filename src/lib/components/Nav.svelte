<script lang="ts">
	import { enhance } from '$app/forms';

	interface User {
		user_id: number;
		email: string;
		username: string;
	}

	let { user }: { user: User | null } = $props();
	let loggingOut = $state(false);
</script>

<nav class="bg-white shadow">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 justify-between">
			<div class="flex">
				<div class="flex flex-shrink-0 items-center">
					<a href="/" class="text-xl font-bold text-gray-900">Pippaothy</a>
				</div>
			</div>
			<div class="flex items-center space-x-4">
				{#if user}
					<span class="text-sm text-gray-600">{user.username}</span>
					<a
						href="/profile"
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
					>
						Profile
					</a>
					<form
						method="POST"
						action="/logout"
						use:enhance={() => {
							loggingOut = true;
							return async ({ update }) => {
								await update();
							};
						}}
					>
						<button
							type="submit"
							disabled={loggingOut}
							class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
						>
							{loggingOut ? 'Logging out...' : 'Logout'}
						</button>
					</form>
				{:else}
					<a
						href="/login"
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
					>
						Login
					</a>
					<a
						href="/register"
						class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					>
						Register
					</a>
				{/if}
			</div>
		</div>
	</div>
</nav>
