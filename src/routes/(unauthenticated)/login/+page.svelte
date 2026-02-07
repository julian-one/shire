<script lang="ts">
	import { page } from '$app/state';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import moment from 'moment';
	import { ClearAuthData, SessionStore, SetSession } from '$lib/stores/session';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { AuthController } from '$lib/controllers/auth';

	let auth_controller = new AuthController();
	let email = $state('');
	let password = $state('');
	let loading = $state(false);

	function redirect_to() {
		let redirect = page.url.searchParams.get('redirect');
		if (redirect) {
			window.location.href = redirect;
		} else {
			window.location.href = '/profile';
		}
	}

	async function handle_login(e: MouseEvent | KeyboardEvent) {
		e.preventDefault();
		loading = true;

		try {
			let session = await auth_controller.Login(email, password);
			SetSession(session);

			redirect_to();
		} catch (error) {
			console.error('Login failed:', error);
			AlertStore.add('Login failed. Please check your credentials and try again.', 'error');
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		const current_session = get(SessionStore);
		console.log('Current session:', current_session);

		if (current_session) {
			const now = moment();
			const is_session_expired = moment(current_session.expires_at).isBefore(now);

			if (!is_session_expired) {
				redirect_to();
				return;
			}
		}

		ClearAuthData();
	});
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<h2 class="text-2xl font-bold">Login</h2>
	<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
		<legend class="fieldset-legend">Login</legend>

		<label
			for="email"
			class="label">Email</label
		>
		<input
			type="email"
			class="input"
			placeholder="Email"
			id="email"
			bind:value={email}
			required
			disabled={loading}
		/>

		<label
			for="password"
			class="label">Password</label
		>
		<input
			type="password"
			class="input"
			placeholder="Password"
			id="password"
			bind:value={password}
			onkeydown={(e: KeyboardEvent) => {
				if (e.key === 'Enter' && email.length > 0 && password.length > 0) {
					handle_login(e);
				}
			}}
			required
			disabled={loading}
		/>

		<button
			class="btn btn-neutral mt-4"
			onclick={handle_login}
			disabled={loading}
		>
			{#if loading}
				<span class="loading loading-spinner"></span>
				Logging In...
			{:else}
				Login
			{/if}
		</button>
	</fieldset>
</div>
