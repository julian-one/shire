<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
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

<div class="hero min-h-screen bg-base-200">
	<div class="card w-full max-w-md bg-base-100 shadow-xl">
		<div class="card-body">
			<h1 class="card-title text-2xl">Create Account</h1>

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
				<div class="form-control w-full">
					<label for="username" class="label">
						<span class="label-text">Username</span>
					</label>
					<input
						id="username"
						name="username"
						type="text"
						required
						value={form?.username ?? ''}
						class="input input-bordered w-full"
						placeholder="johndoe"
					/>
				</div>

				<div class="form-control w-full">
					<label for="email" class="label">
						<span class="label-text">Email</span>
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						value={form?.email ?? ''}
						class="input input-bordered w-full"
						placeholder="you@example.com"
					/>
				</div>

				<div class="form-control w-full">
					<label for="password" class="label">
						<span class="label-text">Password</span>
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						minlength="8"
						bind:value={password}
						class="input input-bordered w-full"
						placeholder="••••••••"
					/>
				</div>

				<div class="form-control w-full">
					<label for="confirmPassword" class="label">
						<span class="label-text">Confirm Password</span>
					</label>
					<input
						id="confirmPassword"
						type="password"
						required
						minlength="8"
						bind:value={confirmPassword}
						class="input input-bordered w-full"
						placeholder="••••••••"
					/>
				</div>

				{#if clientError || form?.error}
					<div class="alert alert-error mt-4">
						<span>{clientError || form?.error}</span>
					</div>
				{/if}

				<div class="form-control mt-6">
					<button type="submit" disabled={loading} class="btn btn-primary">
						{#if loading}
							<span class="loading loading-spinner"></span>
							Creating account...
						{:else}
							Create Account
						{/if}
					</button>
				</div>
			</form>

			<p class="mt-4 text-center text-sm">
				Already have an account?
				<a href="/login" class="link link-primary">Login</a>
			</p>
		</div>
	</div>
</div>
