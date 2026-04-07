<script lang="ts">
	import moment from 'moment';
	import { invalidateAll } from '$app/navigation';
	import { UserStore } from '$lib/stores/user.svelte';
	import type { User } from '$lib/types/user';
	import { RoleDisplay } from '$lib/types/user';

	let { user: current } = $props<{ user: User }>();

	let user = $state<User>({} as User);
	let editing = $state(false);

	let changing_password = $state(false);
	let new_password = $state('');
	let confirm_password = $state('');

	async function handle_update() {
		if (!user.username || user.username === current.username) {
			editing = false;
			return;
		}

		const updated = await UserStore.update_user(current.user_id, user.username);
		if (updated) {
			await invalidateAll();
			editing = false;
		}
	}

	function handle_edit() {
		user = { ...current };
		editing = true;
	}

	async function handle_password_update() {
		if (!new_password || new_password !== confirm_password) return;

		const success = await UserStore.update_password(current.user_id, new_password);
		if (success) {
			changing_password = false;
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
					handle_update();
				}}
			>
				<div class="grid gap-10">
					<!-- Account Details Section -->
					<div class="space-y-6">
						<h3 class="text-base-content/60 text-xs font-bold tracking-wide uppercase">Account Details</h3>

						<div class="grid gap-6">
							<div class="flex items-start justify-between gap-4">
								{#if editing}
									<div class="form-control flex-1">
										<label
											class="label text-base-content/60 pt-0 text-sm font-bold tracking-wide uppercase"
											for="username-input">Username</label
										>
										<input
											id="username-input"
											type="text"
											class="input validator w-full"
											required
											placeholder="Username"
											pattern="[A-Za-z][A-Za-z0-9\-]*"
											minlength="3"
											maxlength="30"
											bind:value={user.username}
										/>
										<p class="validator-hint">
											Must be 3 to 30 characters
											<br />containing only letters, numbers or dash
										</p>
									</div>
									<div class="flex items-center gap-2 pt-7">
										<button
											type="button"
											class="btn btn-ghost btn-sm"
											onclick={() => (editing = false)}
											disabled={UserStore.loading}
										>
											Cancel
										</button>
										<button
											type="submit"
											class="btn btn-primary btn-sm px-6"
											disabled={UserStore.loading}
										>
											{#if UserStore.loading}
												<span class="loading loading-spinner loading-xs"></span>
											{/if}
											Save
										</button>
									</div>
								{:else}
									<div class="space-y-1">
										<div class="text-base-content/60 text-sm font-bold tracking-wide uppercase">Username</div>
										<div class="text-lg font-semibold">{current.username}</div>
									</div>
									<button
										type="button"
										class="btn btn-ghost btn-outline btn-sm"
										onclick={handle_edit}
									>
										Edit
									</button>
								{/if}
							</div>
						</div>
					</div>

					<!-- Security Section -->
					<div class="space-y-6">
						<h3 class="text-base-content/60 text-xs font-bold tracking-wide uppercase">Security</h3>

						<div class="grid gap-6">
							<div class="flex items-start justify-between gap-4">
								{#if changing_password}
									<div class="w-full space-y-4">
										<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<div class="form-control">
												<label
													class="label text-base-content/60 pt-0 text-sm font-bold tracking-wide uppercase"
													for="new-password-input">New Password</label
												>
												<input
													id="new-password-input"
													type="password"
													class="input validator w-full"
													required
													placeholder="New password"
													minlength="8"
													bind:value={new_password}
												/>
												<p class="validator-hint">Must be at least 8 characters</p>
											</div>
											<div class="form-control">
												<label
													class="label text-base-content/60 pt-0 text-sm font-bold tracking-wide uppercase"
													for="confirm-password-input">Confirm Password</label
												>
												<input
													id="confirm-password-input"
													type="password"
													class="input validator w-full"
													required
													placeholder="Confirm password"
													minlength="8"
													bind:value={confirm_password}
												/>
												<p class="validator-hint">Must be at least 8 characters</p>
												{#if confirm_password && new_password !== confirm_password}
													<p class="text-error mt-1 text-xs">Passwords do not match</p>
												{/if}
											</div>
										</div>
										<div class="flex items-center justify-end gap-2">
											<button
												type="button"
												class="btn btn-ghost btn-sm"
												onclick={() => {
													changing_password = false;
													new_password = '';
													confirm_password = '';
												}}
												disabled={UserStore.loading}
											>
												Cancel
											</button>
											<button
												type="button"
												class="btn btn-primary btn-sm px-6"
												disabled={UserStore.loading ||
													!new_password ||
													new_password.length < 8 ||
													new_password !== confirm_password}
												onclick={handle_password_update}
											>
												{#if UserStore.loading}
													<span class="loading loading-spinner loading-xs"></span>
												{/if}
												Save
											</button>
										</div>
									</div>
								{:else}
									<div class="space-y-1">
										<div class="text-base-content/60 text-sm font-bold tracking-wide uppercase">Password</div>
										<div class="text-lg font-semibold">••••••••</div>
									</div>
									<button
										type="button"
										class="btn btn-ghost btn-outline btn-sm"
										onclick={() => (changing_password = true)}
									>
										Change
									</button>
								{/if}
							</div>
						</div>
					</div>

					<div class="space-y-6">
						<h3 class="text-base-content/60 text-xs font-bold tracking-wide uppercase">System Information</h3>

						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div class="space-y-1">
								<div class="text-base-content/60 text-sm font-bold tracking-wide uppercase">Member Since</div>
								<div class="text-lg font-semibold">{moment(current.created_at).format('MMM D, YYYY')}</div>
								<div class="text-base-content/60 text-xs">{moment(current.created_at).fromNow()}</div>
							</div>

							<div class="space-y-1">
								<div class="text-base-content/60 text-sm font-bold tracking-wide uppercase">Last Updated</div>
								<div class="text-lg font-semibold">{moment(current.updated_at).format('MMM D, YYYY')}</div>
								<div class="text-base-content/60 text-xs">{moment(current.updated_at).fromNow()}</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
