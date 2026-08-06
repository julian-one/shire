<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<div class="card border-base-content/10 bg-base-200 border">
	<div class="card-body gap-4">
		{#if data.valid}
			<h1 class="text-3xl font-black tracking-tight md:text-4xl">Welcome, {data.username}</h1>
			<p class="text-sm md:text-base">Choose a password to finish creating your account.</p>
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
						for="password">Password</label
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
				<button class="btn btn-primary">Create account</button>
			</form>
		{:else}
			<h1 class="text-3xl font-black tracking-tight md:text-4xl">Verification failed</h1>
			<Alert message={data.error} />
			<a
				href="/register"
				class="btn btn-primary">Register again</a
			>
		{/if}
	</div>
</div>
