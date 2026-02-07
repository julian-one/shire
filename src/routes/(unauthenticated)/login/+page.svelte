<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<main class="hero flex-1">
	<div class="hero-content w-full">
		<form
			method="POST"
			use:enhance
			class="w-full max-w-xs"
		>
			<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend class="fieldset-legend">login</legend>

				<label
					class="label"
					for="email">email</label
				>
				<input
					id="email"
					name="email"
					class="input"
					placeholder="email"
					value={form?.email ?? ''}
					autocomplete="username"
					required
				/>

				<label
					class="label"
					for="password">password</label
				>
				<input
					id="password"
					name="password"
					type="password"
					class="input"
					placeholder="password"
					autocomplete="current-password"
					required
				/>

				{#if form?.error}
					<p
						class="text-error mt-2 text-sm"
						role="alert"
					>
						{form.error}
					</p>
				{/if}

				<button class="btn btn-neutral mt-4">login</button>
			</fieldset>
		</form>
	</div>
</main>
