<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { isAxiosError } from 'axios';
	import AuthController from '#lib/controllers/auth.js';
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

	const emailDescribedBy = $derived(errorTitle ? 'email-hint login-error' : 'email-hint');
	const passwordDescribedBy = $derived(errorTitle ? 'password-hint login-error' : 'password-hint');
</script>

<svelte:head>
	<title>Sign in · julian-one</title>
</svelte:head>

<LifeCanvas />
<div
	class="flex grow flex-col gap-8 md:grid md:grid-cols-2 md:content-center md:items-center md:gap-0"
>
	<div
		class="flex min-w-0 flex-col items-start gap-4 md:items-end md:pe-8 md:text-end lg:pe-16"
		data-life-clear
	>
		<p class="text-sm tracking-wider text-secondary uppercase">Sign in</p>
		<h1 class="text-5xl leading-none font-bold tracking-tighter wrap-anywhere lg:text-7xl">
			Welcome back
		</h1>
	</div>
	<form
		class="flex w-full flex-col gap-8 md:border-s-2 md:border-base-300 md:ps-8 lg:max-w-116 lg:ps-16"
		data-life-clear
		onsubmit={submit}
	>
		<fieldset class="fieldset gap-4 p-0">
			<div class="flex min-w-0 flex-col gap-1.5">
				<label class="label text-sm tracking-wider text-secondary uppercase" for="email">
					Email
				</label>
				<div class="validator input w-full bg-base-200 text-base focus-within:bg-base-100">
					<EnvelopeIcon class="size-4.5 shrink-0 text-secondary" aria-hidden="true" />
					<input
						id="email"
						class="grow"
						type="email"
						autocomplete="email"
						required
						aria-invalid={rejected}
						aria-describedby={emailDescribedBy}
						bind:value={email}
					/>
				</div>
				<p id="email-hint" class="validator-hint mt-0 text-sm">Enter a valid email address</p>
			</div>
			<div class="flex min-w-0 flex-col gap-1.5">
				<label class="label text-sm tracking-wider text-secondary uppercase" for="password">
					Password
				</label>
				<div class="validator input w-full bg-base-200 text-base focus-within:bg-base-100">
					<KeyIcon class="size-4.5 shrink-0 text-secondary" aria-hidden="true" />
					<input
						id="password"
						class="grow"
						type={showPassword ? 'text' : 'password'}
						autocomplete="current-password"
						required
						aria-invalid={rejected}
						aria-describedby={passwordDescribedBy}
						value={password}
						oninput={(event) => {
							password = event.currentTarget.value;
						}}
					/>
					<button
						class={['btn -me-3 btn-circle size-10 btn-ghost', { 'btn-active': showPassword }]}
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
				<p id="password-hint" class="validator-hint mt-0 text-sm">Enter your password</p>
			</div>
		</fieldset>
		<div class="flex flex-col gap-3">
			<button
				class="btn border-primary bg-base-100 text-base whitespace-nowrap text-primary hover:bg-base-300"
				type="submit"
				aria-disabled={submitting}
			>
				Sign in
				<SignInIcon class="size-5 shrink-0" aria-hidden="true" />
			</button>
			<button
				class="btn border-base-content bg-base-100 text-base whitespace-nowrap hover:bg-base-300 disabled:border-base-300 disabled:bg-base-100 disabled:text-secondary"
				type="button"
				disabled
				aria-disabled="true"
			>
				<AppleLogoIcon class="size-5 shrink-0" aria-hidden="true" />
				Sign in with Apple
			</button>
		</div>
		<div class="min-h-14 md:-mb-22" role="alert">
			{#if errorTitle}
				<div
					id="login-error"
					class="alert items-start gap-3 rounded-box border-0 alert-soft p-4 text-base alert-error"
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
</div>
