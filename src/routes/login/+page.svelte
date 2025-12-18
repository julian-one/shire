<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	let loading = $state(false);
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="card w-full max-w-md bg-base-100 shadow-xl">
		<div class="card-body p-4 sm:p-8">
			<h1 class="card-title text-xl sm:text-2xl">Login</h1>

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						try {
							await update();
						} finally {
							loading = false;
						}
					};
				}}
			>
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
						class="input input-bordered w-full"
						placeholder="••••••••"
					/>
				</div>

				{#if form?.error}
					<div class="alert alert-error mt-4">
						<span>{form.error}</span>
					</div>
				{/if}

				<div class="form-control mt-6">
					<button type="submit" disabled={loading} class="btn btn-primary">
						{#if loading}
							<span class="loading loading-spinner"></span>
							Logging in...
						{:else}
							Login
						{/if}
					</button>
				</div>
			</form>

		</div>
	</div>
</div>
