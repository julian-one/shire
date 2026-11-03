<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { isAxiosError } from 'axios';
	import AuthController from '#lib/controllers/auth.js';

	const auth = new AuthController();

	let email = $state('');
	let password = $state('');
	let message = $state('');
	let submitting = $state(false);
	let ready = $state(false);

	onMount(() => {
		ready = true;
	});

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		submitting = true;
		message = '';
		try {
			await auth.login(email, password);
			await goto(resolve('/(authenticated)'));
		} catch (error) {
			const status = isAxiosError(error) ? error.response?.status : undefined;
			const rejected = status === 400 || status === 401;
			if (rejected) {
				message = 'Invalid email or password.';
			} else {
				message = 'Something went wrong. Please try again.';
			}
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-base-200 p-4">
	<div class="card w-full max-w-sm bg-base-100 shadow-xl">
		<form class="card-body" onsubmit={submit}>
			<h1 class="card-title">Log in</h1>
			<fieldset class="fieldset">
				<label class="label" for="email">Email</label>
				<input
					id="email"
					class="input w-full"
					type="email"
					autocomplete="email"
					required
					bind:value={email}
				/>
				<label class="label" for="password">Password</label>
				<input
					id="password"
					class="input w-full"
					type="password"
					autocomplete="current-password"
					required
					bind:value={password}
				/>
			</fieldset>
			{#if message}
				<p class="text-error">{message}</p>
			{/if}
			<div class="mt-2 card-actions">
				<button class="btn w-full btn-primary" type="submit" disabled={!ready || submitting}>
					Log in
				</button>
			</div>
		</form>
	</div>
</div>
