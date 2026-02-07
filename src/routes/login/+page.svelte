<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<main class="flex min-h-screen flex-col items-center justify-center p-4">
	<form
		method="POST"
		use:enhance
	>
		<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
			<legend class="fieldset-legend">Login</legend>

			<label
				class="label"
				for="email">Email</label
			>
			<input
				id="email"
				name="email"
				type="email"
				class="input"
				placeholder="Email"
				value={form?.email ?? ''}
				autocomplete="username"
				required
			/>

			<label
				class="label"
				for="password">Password</label
			>
			<input
				id="password"
				name="password"
				type="password"
				class="input"
				placeholder="Password"
				autocomplete="current-password"
				required
			/>

			{#if form?.error}
				<p class="text-error mt-2 text-sm">{form.error}</p>
			{/if}

			<button class="btn btn-neutral mt-4">Login</button>
		</fieldset>
	</form>
</main>
