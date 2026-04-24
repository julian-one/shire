<script lang="ts">
	import moment from 'moment';
	import { invalidateAll } from '$app/navigation';
	import { UserStore } from '$lib/stores/user.svelte';
	import type { User } from '$lib/types/user';
	import { RoleDisplay } from '$lib/types/user';

	let { user: current } = $props<{ user: User }>();

	let editing = $state(false);
	let username = $state('');
	let new_password = $state('');
	let confirm_password = $state('');

	let passwords_match = $derived(!new_password || !confirm_password || new_password === confirm_password);

	let password_valid = $derived(!new_password || new_password.length >= 8);

	let can_save = $derived(!UserStore.loading && passwords_match && password_valid);

	function handle_edit() {
		username = current.username;
		new_password = '';
		confirm_password = '';
		editing = true;
	}

	function handle_cancel() {
		editing = false;
		username = '';
		new_password = '';
		confirm_password = '';
	}

	async function handle_save() {
		const username_changed = username && username !== current.username;
		const password_changed = new_password && new_password === confirm_password && new_password.length >= 8;

		if (!username_changed && !password_changed) {
			editing = false;
			return;
		}

		let success = true;

		if (username_changed) {
			const updated = await UserStore.update_user(current.user_id, username);
			if (!updated) success = false;
		}

		if (password_changed) {
			const result = await UserStore.update_password(current.user_id, new_password);
			if (!result) success = false;
		}

		if (success) {
			const form_data = new FormData();
			await fetch('?/invalidate_session', { method: 'POST', body: form_data });
			await invalidateAll();
			editing = false;
			new_password = '';
			confirm_password = '';
		}
	}
</script>

<div class="w-full max-w-2xl px-4">
	<div class="card bg-base-100 border-base-content/10 border">
		<div class="card-body p-0">
			<!-- Profile Header -->
			<div class="flex flex-col items-center gap-4 p-8 sm:flex-row sm:gap-8">
				<div class="avatar placeholder">
					<div
						class="bg-primary text-primary-content ring-primary ring-offset-base-100 flex w-24 items-center justify-center rounded-full ring ring-offset-2"
					>
						<span class="text-4xl font-bold">{current.username.charAt(0).toUpperCase()}</span>
					</div>
				</div>
				<div class="flex flex-col items-center text-center sm:items-start sm:text-left">
					<h2 class="text-3xl font-black tracking-tight md:text-4xl">{current.username}</h2>
					<p class="text-base-content/60 font-medium">{current.email}</p>
					<div class="badge badge-secondary badge-sm mt-3 font-bold tracking-wider uppercase">
						{RoleDisplay.get(current.role)}
					</div>
				</div>
			</div>

			<form
				class="p-6 sm:p-8"
				onsubmit={(e) => {
					e.preventDefault();
					handle_save();
				}}
			>
				<div class="grid gap-10">
					<!-- Account Details -->
					<div class="space-y-6">
						<div class="flex items-center justify-between">
							<h3 class="text-base-content/60 text-xs font-bold tracking-wide uppercase"> Account Details </h3>
							{#if editing}
								<div class="flex items-center gap-2">
									<button
										type="button"
										class="btn btn-ghost btn-sm"
										onclick={handle_cancel}
										disabled={UserStore.loading}
									>
										Cancel
									</button>
									<button
										type="submit"
										class="btn btn-primary btn-sm px-6"
										disabled={!can_save}
									>
										{#if UserStore.loading}
											<span class="loading loading-spinner loading-xs"></span>
										{/if}
										Save
									</button>
								</div>
							{:else}
								<button
									type="button"
									class="btn btn-ghost btn-outline btn-sm"
									onclick={handle_edit}
								>
									Edit Profile
								</button>
							{/if}
						</div>

						<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div class="space-y-1">
								<div class="text-base-content/60 text-sm font-bold tracking-wide uppercase"> Username </div>
								{#if editing}
									<input
										id="username-input"
										type="text"
										class="input validator w-full"
										required
										placeholder="Username"
										pattern="[A-Za-z][A-Za-z0-9\-]*"
										minlength="3"
										maxlength="30"
										bind:value={username}
									/>
									<p class="validator-hint">
										Must be 3 to 30 characters
										<br />containing only letters, numbers or dash
									</p>
								{:else}
									<div class="text-lg font-semibold">{current.username}</div>
								{/if}
							</div>

							<div class="space-y-1">
								<div class="text-base-content/60 text-sm font-bold tracking-wide uppercase"> Password </div>
								{#if editing}
									<input
										id="new-password-input"
										type="password"
										class="input validator w-full"
										placeholder="New password"
										minlength="8"
										bind:value={new_password}
									/>
									<p class="validator-hint">Must be at least 8 characters</p>
									{#if new_password}
										<div class="mt-3 space-y-1">
											<div class="text-base-content/60 text-sm font-bold tracking-wide uppercase">
												Confirm Password
											</div>
											<input
												id="confirm-password-input"
												type="password"
												class="input validator w-full"
												placeholder="Confirm password"
												minlength="8"
												bind:value={confirm_password}
											/>
											<p class="validator-hint">Must be at least 8 characters</p>
											{#if confirm_password && new_password !== confirm_password}
												<p class="text-error mt-1 text-xs">Passwords do not match</p>
											{/if}
										</div>
									{/if}
									<p class="text-base-content/40 mt-2 text-xs"> Leave empty to keep your current password. </p>
								{:else}
									<div class="text-lg font-semibold">••••••••</div>
								{/if}
							</div>
						</div>
					</div>

					<!-- System Information -->
					<div class="space-y-6">
						<h3 class="text-base-content/60 text-xs font-bold tracking-wide uppercase"> System Information </h3>

						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div class="space-y-1">
								<div class="text-base-content/60 text-sm font-bold tracking-wide uppercase"> Member Since </div>
								<div class="text-lg font-semibold">
									{moment(current.created_at).format('MMM D, YYYY')}
								</div>
								<div class="text-base-content/60 text-xs">
									{moment(current.created_at).fromNow()}
								</div>
							</div>

							<div class="space-y-1">
								<div class="text-base-content/60 text-sm font-bold tracking-wide uppercase"> Last Updated </div>
								<div class="text-lg font-semibold">
									{moment(current.updated_at).format('MMM D, YYYY')}
								</div>
								<div class="text-base-content/60 text-xs">
									{moment(current.updated_at).fromNow()}
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
