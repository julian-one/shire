<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<div class="card border-base-content/10 bg-base-200 border">
	<div class="card-body gap-4">
		<h1 class="text-3xl font-black tracking-tight md:text-4xl">Forgot password</h1>
		{#if form?.sent}
			<Alert
				kind="success"
				message={form.message ?? 'Password reset email sent.'}
			/>
			<p class="text-sm md:text-base">The reset link is valid for 30 minutes.</p>
		{:else}
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
						for="email">Email</label
					>
					<input
						id="email"
						name="email"
						type="email"
						class="input w-full"
						autocomplete="email"
						required
					/>
				</div>
				<button class="btn btn-primary">Send reset email</button>
			</form>
			<a
				href="/login"
				class="link text-sm md:text-base">Back to log in</a
			>
		{/if}
	</div>
</div>
