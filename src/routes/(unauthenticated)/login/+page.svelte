<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<div class="card border-base-content/10 bg-base-200 border">
	<div class="card-body gap-4">
		<h1 class="text-3xl font-black tracking-tight md:text-4xl">Log in</h1>
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
					for="identifier">Username or email</label
				>
				<input
					id="identifier"
					name="identifier"
					class="input w-full"
					autocomplete="username"
					value={form?.identifier ?? ''}
					required
				/>
			</div>
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
					autocomplete="current-password"
					required
				/>
			</div>
			<button class="btn btn-primary">Log in</button>
		</form>
	</div>
</div>
