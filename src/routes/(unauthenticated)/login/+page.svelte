<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { prefersReducedMotion } from 'svelte/motion';
	import { isAxiosError } from 'axios';
	import AuthController from '#lib/controllers/auth.js';
	import Navbar from '#lib/components/Navbar.svelte';
	import LifeCanvas from '#lib/components/LifeCanvas.svelte';
	import {
		AppleLogoIcon,
		EnvelopeIcon,
		EyeIcon,
		EyeSlashIcon,
		KeyIcon,
		SignInIcon,
		WarningCircleIcon
	} from 'phosphor-svelte';

	const auth = new AuthController();

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let errorTitle = $state('');
	let errorBody = $state('');
	let rejected = $state(false);
	let submitting = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) {
			return;
		}
		submitting = true;
		errorTitle = '';
		errorBody = '';
		rejected = false;
		try {
			await auth.login(email, password);
			await goto(resolve('/(authenticated)/home'));
		} catch (error) {
			const status = isAxiosError(error) ? error.response?.status : undefined;
			rejected = status === 400 || status === 401;
			if (rejected) {
				errorTitle = 'Invalid email or password.';
				errorBody = 'Check both and try again.';
			} else {
				errorTitle = 'Something went wrong.';
				errorBody = 'Please try again in a moment.';
			}
		} finally {
			submitting = false;
		}
	}

	const errorId = $derived(errorTitle ? 'login-error' : undefined);
</script>

<svelte:head>
	<title>Sign in · julian-one</title>
</svelte:head>

<div class="relative isolate flex min-h-screen flex-col">
	{#if !prefersReducedMotion.current}
		<LifeCanvas />
	{/if}
	<Navbar />
	<main
		class="mx-auto flex w-full max-w-xl grow flex-col gap-6 px-4 pt-8 pb-16 md:gap-8 md:px-8 lg:max-w-6xl lg:flex-row lg:items-center lg:gap-16 lg:pt-14 lg:pb-24"
	>
		<div class="flex min-w-0 flex-col items-start gap-4 lg:grow">
			<p class="text-sm tracking-wider text-secondary uppercase">Sign in</p>
			<h1
				class="text-5xl leading-none font-bold tracking-tighter wrap-anywhere md:text-6xl lg:text-7xl"
			>
				Welcome back
			</h1>
		</div>
		<form class="flex w-full flex-col gap-8 lg:w-md lg:shrink-0" onsubmit={submit}>
			<fieldset class="fieldset gap-4 p-0">
				<div class="flex min-w-0 flex-col gap-1.5">
					<label class="label text-sm tracking-wider text-secondary uppercase" for="email">
						Email
					</label>
					<div class="validator input w-full input-lg">
						<EnvelopeIcon class="size-4.5 shrink-0 text-secondary" aria-hidden="true" />
						<input
							id="email"
							class="grow"
							type="email"
							autocomplete="email"
							required
							aria-invalid={rejected}
							aria-describedby={errorId}
							bind:value={email}
						/>
					</div>
				</div>
				<div class="flex min-w-0 flex-col gap-1.5">
					<label class="label text-sm tracking-wider text-secondary uppercase" for="password">
						Password
					</label>
					<div class="validator input w-full input-lg">
						<KeyIcon class="size-4.5 shrink-0 text-secondary" aria-hidden="true" />
						<input
							id="password"
							class="grow"
							type={showPassword ? 'text' : 'password'}
							autocomplete="current-password"
							required
							aria-invalid={rejected}
							aria-describedby={errorId}
							value={password}
							oninput={(event) => {
								password = event.currentTarget.value;
							}}
						/>
						<button
							class={['btn -me-3 btn-circle btn-ghost', { 'btn-active': showPassword }]}
							type="button"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
							aria-pressed={showPassword}
							aria-controls="password"
							onclick={() => {
								showPassword = !showPassword;
							}}
						>
							{#if showPassword}
								<EyeSlashIcon class="size-4.5" aria-hidden="true" />
							{:else}
								<EyeIcon class="size-4.5" aria-hidden="true" />
							{/if}
						</button>
					</div>
				</div>
			</fieldset>
			<div class="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
				<button class="btn btn-neutral btn-lg" type="submit" aria-disabled={submitting}>
					Sign in
					<SignInIcon class="size-5 shrink-0" aria-hidden="true" />
				</button>
				<button class="btn btn-outline btn-lg" type="button" disabled aria-disabled="true">
					<AppleLogoIcon class="size-5 shrink-0" aria-hidden="true" />
					Sign in with Apple
				</button>
			</div>
			<div class="min-h-14" role="alert">
				{#if errorTitle}
					<div
						id="login-error"
						class="alert items-start gap-3 rounded-field border-0 alert-soft p-4 text-base alert-error"
					>
						<WarningCircleIcon class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
						<p>
							<strong class="font-bold">{errorTitle}</strong>
							{errorBody}
						</p>
					</div>
				{/if}
			</div>
		</form>
	</main>
</div>
