<script lang="ts">
	import moment from 'moment';
	import { UserStore } from '$lib/stores/user.svelte';
	import { AuthStore } from '$lib/stores/auth.svelte';
	import type { User } from '$lib/types/user';
	import { RoleDisplay } from '$lib/types/user';

	let { user: current } = $props<{ user: User }>();

	let user = $state<User>({} as User);
	let editing = $state(false);

	async function handle_update() {
		if (!user.username || user.username === current.username) {
			editing = false;
			return;
		}

		const updated = await UserStore.update_user(current.user_id, { username: user.username });
		if (updated) {
			AuthStore.user = updated;
			editing = false;
		}
	}

	function handle_edit() {
		user = { ...current };
		editing = true;
	}
</script>

<div class="w-full max-w-2xl px-4">
	<div class="card bg-base-100 shadow-2xl">
		<div class="card-body p-0">
			<!-- Profile Header -->
			<div class="bg-primary/5 flex flex-col items-center gap-4 rounded-t-2xl p-8 sm:flex-row sm:gap-8">
				<div class="avatar placeholder">
					<div
						class="bg-primary text-primary-content ring-primary ring-offset-base-100 flex w-24 items-center justify-center rounded-full ring ring-offset-2"
					>
						<span class="text-4xl font-bold">{current.username.charAt(0).toUpperCase()}</span>
					</div>
				</div>
				<div class="flex flex-col items-center text-center sm:items-start sm:text-left">
					<h2 class="text-3xl font-black tracking-tight">{current.username}</h2>
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
						<div class="flex items-center gap-2">
							<span class="bg-primary h-1.5 w-1.5 rounded-full"></span>
							<h3 class="text-base-content/40 text-xs font-bold tracking-widest uppercase"> Account Details </h3>
						</div>

						<div class="grid gap-6">
							<div class="flex items-start justify-between gap-4">
								{#if editing}
									<div class="form-control flex-1">
										<label
											class="label pt-0"
											for="username-input"
										>
											<span class="label-text text-base-content/40 text-xs font-bold uppercase">Username</span>
										</label>
										<input
											id="username-input"
											type="text"
											class="input input-bordered validator w-full"
											required
											placeholder="Username"
											pattern="[A-Za-z][A-Za-z0-9\-]*"
											minlength="3"
											maxlength="30"
											title="Only letters, numbers or dash"
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
										<div class="text-base-content/40 text-xs font-bold uppercase">Username</div>
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

							<div class="divider my-0 opacity-50"></div>

							<div class="flex items-center justify-between gap-4">
								<div class="space-y-1">
									<div class="text-base-content/40 text-xs font-bold uppercase">Email Address</div>
									<div class="text-lg font-semibold">{current.email}</div>
								</div>
								<div class="badge badge-success badge-outline badge-sm font-bold">VERIFIED</div>
							</div>
						</div>
					</div>

					<!-- System Info Section -->
					<div class="space-y-6">
						<div class="flex items-center gap-2">
							<span class="bg-secondary h-1.5 w-1.5 rounded-full"></span>
							<h3 class="text-base-content/40 text-xs font-bold tracking-widest uppercase"> System Information </h3>
						</div>

						<div class="stats stats-vertical sm:stats-horizontal bg-base-200 w-full overflow-hidden">
							<div class="stat px-6 py-4">
								<div class="stat-title text-xs font-bold uppercase opacity-60">Member Since</div>
								<div class="stat-value text-xl">{moment(current.created_at).format('MMM D, YYYY')}</div>
								<div class="stat-desc font-medium">{moment(current.created_at).fromNow()}</div>
							</div>

							<div class="stat border-base-300 border-t px-6 py-4 sm:border-t-0 sm:border-l">
								<div class="stat-title text-xs font-bold uppercase opacity-60">Last Updated</div>
								<div class="stat-value text-xl">{moment(current.updated_at).format('MMM D, YYYY')}</div>
								<div class="stat-desc font-medium">{moment(current.updated_at).fromNow()}</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
