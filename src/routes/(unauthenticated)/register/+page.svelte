<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<div class="card border-base-content/10 bg-base-200 border">
	<div class="card-body gap-4">
		<h1 class="text-3xl font-black tracking-tight md:text-4xl">Register</h1>
		{#if form?.sent}
			<Alert
				kind="success"
				message="Verification email sent to {form.email}. The link is valid for 24 hours."
			/>
			<p class="text-sm md:text-base">
				Follow the link in the email to choose a password and finish creating your account.
			</p>
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
						for="username">Username</label
					>
					<input
						id="username"
						name="username"
						class="input w-full"
						autocomplete="username"
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
						autocomplete="email"
						value={form?.email ?? ''}
						required
					/>
				</div>
				<button class="btn btn-primary">Send verification email</button>
			</form>
			<span class="text-sm md:text-base">
				Already have an account?
				<a
					href="/login"
					class="link">Log in</a
				>
			</span>
		{/if}
	</div>
</div>
