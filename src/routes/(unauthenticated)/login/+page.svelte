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
	let rejected = $state(false);
	let submitting = $state(false);
	let ready = $state(false);

	onMount(() => {
		ready = true;
	});

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) {
			return;
		}
		submitting = true;
		message = '';
		rejected = false;
		try {
			await auth.login(email, password);
			await goto(resolve('/(authenticated)'));
		} catch (error) {
			const status = isAxiosError(error) ? error.response?.status : undefined;
			rejected = status === 400 || status === 401;
			if (rejected) {
				message = 'Invalid email or password.';
			} else {
				message = 'Something went wrong. Please try again.';
			}
		} finally {
			submitting = false;
		}
	}

	let errorId = $derived(message ? 'login-error' : undefined);
</script>

<svelte:head>
	<title>Log in · Shire</title>
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-base-200 p-4">
	<div class="card w-full max-w-sm bg-base-100 shadow-xl">
		<form class="card-body" onsubmit={submit}>
			<h1 class="card-title">Log in</h1>
			<fieldset class="fieldset">
				<label class="label text-sm text-base-content" for="email">Email</label>
				<input
					id="email"
					class="input w-full input-neutral"
					type="email"
					autocomplete="email"
					required
					aria-invalid={rejected}
					aria-describedby={errorId}
					bind:value={email}
				/>
				<label class="label text-sm text-base-content" for="password">Password</label>
				<input
					id="password"
					class="input w-full input-neutral"
					type="password"
					autocomplete="current-password"
					required
					aria-invalid={rejected}
					aria-describedby={errorId}
					bind:value={password}
				/>
			</fieldset>
			{#if message}
				<p id="login-error" class="text-error" role="alert">{message}</p>
			{/if}
			<div class="mt-2 card-actions">
				<button
					class="btn w-full btn-primary"
					type="submit"
					disabled={!ready}
					aria-disabled={submitting}
				>
					Log in
				</button>
			</div>
		</form>
	</div>
</main>
