<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let loading = $state(false);
	let password = $state('');
	let confirmPassword = $state('');
	let clientError = $state('');

	function validatePasswords() {
		if (password !== confirmPassword) {
			clientError = 'Passwords do not match';
			return false;
		}
		if (password.length < 8) {
			clientError = 'Password must be at least 8 characters';
			return false;
		}
		clientError = '';
		return true;
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
		<h1 class="mb-6 text-2xl font-bold">Create Account</h1>

		<form
			method="POST"
			use:enhance={({ cancel }) => {
				if (!validatePasswords()) {
					cancel();
					return;
				}
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			<div class="mb-4">
				<label for="username" class="mb-2 block text-sm font-medium">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					required
					value={form?.username ?? ''}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					placeholder="johndoe"
				/>
			</div>

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

			<div class="mb-4">
				<label for="password" class="mb-2 block text-sm font-medium">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					minlength="8"
					bind:value={password}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					placeholder="••••••••"
				/>
			</div>

			<div class="mb-6">
				<label for="confirmPassword" class="mb-2 block text-sm font-medium">Confirm Password</label>
				<input
					id="confirmPassword"
					type="password"
					required
					minlength="8"
					bind:value={confirmPassword}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					placeholder="••••••••"
				/>
			</div>

			{#if clientError || form?.error}
				<div class="mb-4 rounded-md bg-red-100 p-3 text-red-700">
					{clientError || form?.error}
				</div>
			{/if}

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
			>
				{loading ? 'Creating account...' : 'Create Account'}
			</button>
		</form>

		<p class="mt-4 text-center text-sm text-gray-600">
			Already have an account?
			<a href="/login" class="text-blue-600 hover:underline">Login</a>
		</p>
	</div>
</div>
