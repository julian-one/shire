<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let loading = $state(false);
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
		<h1 class="mb-6 text-2xl font-bold">Login</h1>

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			<div class="mb-4">
				<label for="email" class="mb-2 block text-sm font-medium">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					value={form?.email ?? ''}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					placeholder="you@example.com"
				/>
			</div>

			<div class="mb-6">
				<label for="password" class="mb-2 block text-sm font-medium">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					placeholder="••••••••"
				/>
			</div>

			{#if form?.error}
				<div class="mb-4 rounded-md bg-red-100 p-3 text-red-700">
					{form.error}
				</div>
			{/if}

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
			>
				{loading ? 'Logging in...' : 'Login'}
			</button>
		</form>

		<p class="mt-4 text-center text-sm text-gray-600">
			Don't have an account?
			<a href="/register" class="text-blue-600 hover:underline">Register</a>
		</p>
	</div>
</div>
