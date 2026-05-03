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
	let show_new_password = $state(false);
	let show_confirm_password = $state(false);

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
									<div class="relative w-full">
										<input
											id="new-password-input"
											type={show_new_password ? 'text' : 'password'}
											class="input validator w-full pr-10"
											placeholder="New password"
											minlength="8"
											bind:value={new_password}
										/>
										<button
											type="button"
											class="text-base-content/50 absolute top-1/2 right-3 -translate-y-1/2"
											onclick={() => (show_new_password = !show_new_password)}
											aria-label={show_new_password ? 'Hide password' : 'Show password'}
										>
											{#if show_new_password}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path
														d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
													/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line
														x1="2"
														x2="22"
														y1="2"
														y2="22"
													/></svg
												>
											{:else}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													><path
														d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
													/><circle
														cx="12"
														cy="12"
														r="3"
													/></svg
												>
											{/if}
										</button>
									</div>
									<p class="validator-hint">Must be at least 8 characters</p>
									{#if new_password}
										<div class="mt-3 space-y-1">
											<div class="text-base-content/60 text-sm font-bold tracking-wide uppercase">
												Confirm Password
											</div>
											<div class="relative w-full">
												<input
													id="confirm-password-input"
													type={show_confirm_password ? 'text' : 'password'}
													class="input validator w-full pr-10"
													placeholder="Confirm password"
													minlength="8"
													bind:value={confirm_password}
												/>
												<button
													type="button"
													class="text-base-content/50 absolute top-1/2 right-3 -translate-y-1/2"
													onclick={() => (show_confirm_password = !show_confirm_password)}
													aria-label={show_confirm_password ? 'Hide password' : 'Show password'}
												>
													{#if show_confirm_password}
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="16"
															height="16"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
															><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path
																d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
															/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line
																x1="2"
																x2="22"
																y1="2"
																y2="22"
															/></svg
														>
													{:else}
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="16"
															height="16"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
															><path
																d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
															/><circle
																cx="12"
																cy="12"
																r="3"
															/></svg
														>
													{/if}
												</button>
											</div>
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
