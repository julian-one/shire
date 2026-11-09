<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { prefersReducedMotion } from 'svelte/motion';
	import { isAxiosError } from 'axios';
	import AuthController from '#lib/controllers/auth.js';
	import Navbar from '#lib/components/Navbar.svelte';
	import LifeCanvas from '#lib/components/LifeCanvas.svelte';

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
						<svg
							class="size-4.5 shrink-0 text-secondary"
							aria-hidden="true"
							viewBox="0 0 256 256"
							fill="currentColor"
						>
							<path
								d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"
							/>
						</svg>
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
						<svg
							class="size-4.5 shrink-0 text-secondary"
							aria-hidden="true"
							viewBox="0 0 256 256"
							fill="currentColor"
						>
							<path
								d="M216.57,39.43A80,80,0,0,0,83.91,120.78L28.69,176A15.86,15.86,0,0,0,24,187.31V216a16,16,0,0,0,16,16H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A79.73,79.73,0,0,0,160,176h.1A80,80,0,0,0,216.57,39.43ZM224,98.1c-1.09,34.09-29.75,61.86-63.89,61.9H160a63.7,63.7,0,0,1-23.65-4.51,8,8,0,0,0-8.84,1.68L116.69,168H96a8,8,0,0,0-8,8v16H72a8,8,0,0,0-8,8v16H40V187.31l58.83-58.82a8,8,0,0,0,1.68-8.84A63.72,63.72,0,0,1,96,95.92c0-34.14,27.81-62.8,61.9-63.89A64,64,0,0,1,224,98.1ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"
							/>
						</svg>
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
							<svg class="size-4.5" aria-hidden="true" viewBox="0 0 256 256" fill="currentColor">
								<path
									d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"
								/>
							</svg>
						</button>
					</div>
				</div>
			</fieldset>
			<div class="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
				<button class="btn btn-neutral btn-lg" type="submit" aria-disabled={submitting}>
					Sign in
					<svg class="size-5 shrink-0" aria-hidden="true" viewBox="0 0 256 256" fill="currentColor">
						<path
							d="M141.66,133.66l-40,40a8,8,0,0,1-11.32-11.32L116.69,136H24a8,8,0,0,1,0-16h92.69L90.34,93.66a8,8,0,0,1,11.32-11.32l40,40A8,8,0,0,1,141.66,133.66ZM200,32H136a8,8,0,0,0,0,16h56V208H136a8,8,0,0,0,0,16h64a8,8,0,0,0,8-8V40A8,8,0,0,0,200,32Z"
						/>
					</svg>
				</button>
				<button class="btn btn-outline btn-lg" type="button" disabled aria-disabled="true">
					<svg class="size-5 shrink-0" aria-hidden="true" viewBox="0 0 256 256" fill="currentColor">
						<path
							d="M223.3,169.59a8.07,8.07,0,0,0-2.8-3.4C203.53,154.53,200,134.64,200,120c0-17.67,13.47-33.06,21.5-40.67a8,8,0,0,0,0-11.62C208.82,55.74,187.82,48,168,48a72.2,72.2,0,0,0-40,12.13,71.56,71.56,0,0,0-90.71,9.09A74.63,74.63,0,0,0,16,123.4a127.06,127.06,0,0,0,40.14,89.73A39.8,39.8,0,0,0,83.59,224h87.68a39.84,39.84,0,0,0,29.12-12.57,125,125,0,0,0,17.82-24.6C225.23,174,224.33,172,223.3,169.59Zm-34.63,30.94a23.76,23.76,0,0,1-17.4,7.47H83.59a23.82,23.82,0,0,1-16.44-6.51A111.14,111.14,0,0,1,32,123,58.5,58.5,0,0,1,48.65,80.47,54.81,54.81,0,0,1,88,64h.78A55.45,55.45,0,0,1,123,76.28a8,8,0,0,0,10,0A55.44,55.44,0,0,1,168,64a70.64,70.64,0,0,1,36,10.35c-13,14.52-20,30.47-20,45.65,0,23.77,7.64,42.73,22.18,55.3A105.82,105.82,0,0,1,188.67,200.53ZM128.23,30A40,40,0,0,1,167,0h1a8,8,0,0,1,0,16h-1a24,24,0,0,0-23.24,18,8,8,0,1,1-15.5-4Z"
						/>
					</svg>
					Sign in with Apple
				</button>
			</div>
			<div class="min-h-14" role="alert">
				{#if errorTitle}
					<div
						id="login-error"
						class="alert items-start gap-3 rounded-field border-0 alert-soft p-4 text-base alert-error"
					>
						<svg
							class="mt-0.5 size-5 shrink-0"
							aria-hidden="true"
							viewBox="0 0 256 256"
							fill="currentColor"
						>
							<path
								d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"
							/>
						</svg>
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
