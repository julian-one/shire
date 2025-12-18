<script lang="ts">
	import { page } from '$app/state';
	import { SetSession } from '$lib/stores/session';
	import { AuthController } from '$lib/controllers/auth';

	let auth_controller = new AuthController();
	let username = $state('');
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

	async function handle_register(e: MouseEvent | KeyboardEvent) {
		e.preventDefault();
		loading = true;

		try {
			let session = await auth_controller.Register(username, email, password);
			SetSession(session);

			redirect_to();
		} catch (error) {
			console.error('Registration failed:', error);
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<h2 class="text-2xl font-bold">Register</h2>
	<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
		<legend class="fieldset-legend">Register</legend>

		<label
			for="username"
			class="label">Username</label
		>
		<input
			type="text"
			class="input"
			placeholder="Username"
			id="username"
			bind:value={username}
			required
			disabled={loading}
		/>

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
					handle_register(e);
				}
			}}
			required
			disabled={loading}
		/>

		<button
			class="btn btn-neutral mt-4"
			onclick={handle_register}
			disabled={loading}
		>
			{#if loading}
				<span class="loading loading-spinner"></span>
				Registering...
			{:else}
				Register
			{/if}
		</button>
	</fieldset>
</div>
