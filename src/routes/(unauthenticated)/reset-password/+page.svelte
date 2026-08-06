<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<div class="card border-base-content/10 bg-base-200 border">
	<div class="card-body gap-4">
		<h1 class="text-3xl font-black tracking-tight md:text-4xl">Reset password</h1>
		{#if form?.success}
			<Alert
				kind="success"
				message="Password updated. Log in with your new password."
			/>
			<a
				href="/login"
				class="btn btn-primary">Log in</a
			>
		{:else if data.has_token}
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
						for="password">New password</label
					>
					<input
						id="password"
						name="password"
						type="password"
						class="input w-full"
						autocomplete="new-password"
						minlength="8"
						required
					/>
				</div>
				<div class="flex flex-col gap-1">
					<label
						class="label"
						for="confirm">Confirm password</label
					>
					<input
						id="confirm"
						name="confirm"
						type="password"
						class="input w-full"
						autocomplete="new-password"
						minlength="8"
						required
					/>
				</div>
				<button class="btn btn-primary">Update password</button>
			</form>
		{:else}
			<Alert message="The reset link is missing its token." />
			<a
				href="/forgot-password"
				class="btn btn-primary">Request a new link</a
			>
		{/if}
	</div>
</div>
