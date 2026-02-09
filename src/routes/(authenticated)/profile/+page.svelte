<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import moment from 'moment';
	import { SessionStore } from '$lib/stores/session';
	import { UserStore } from '$lib/stores/user.svelte';
	import { RoleDisplay } from '$lib/types/user';

	let session = $derived($SessionStore);

	onMount(async () => {
		if (session) {
			UserStore.load_user(session.user_id);
		}
	});
</script>

{#if UserStore.loading}
	<div class="container m-auto flex min-h-96 items-center justify-center px-4 sm:px-6 lg:px-0">
		<div class="loading loading-ring loading-xl h-24 w-24"></div>
	</div>
{:else if UserStore.user}
	<div class="container mx-auto px-4 py-8">
		<div class="flex justify-center">
			<div class="card bg-base-100 w-full max-w-2xl shadow-xl">
				<div class="card-body">
					<h2 class="card-title mx-auto mb-4 w-fit text-3xl font-bold">{UserStore.user.username}</h2>
					<div class="mb-2 text-lg">
						<p><span class="font-semibold">Email:</span> {UserStore.user.email}</p>
					</div>
					<div class="mb-4 text-lg">
						<p><span class="font-semibold">ID:</span> {UserStore.user.user_id}</p>
					</div>

					<div class="stats lg:stats-horizontal mb-6 w-full shadow">
						<div class="stat p-2">
							<div class="stat-title text-sm">Role</div>
							<div class="stat-value text-secondary text-sm">{RoleDisplay.get(UserStore.user.role)}</div>
						</div>

						<div class="stat p-2">
							<div class="stat-title text-sm">Member Since</div>
							<div class="stat-value text-accent text-sm">
								{moment(UserStore.user.created_at).format('MMMM Do YYYY')}
							</div>
							<div class="stat-desc text-xs">
								{moment(UserStore.user.created_at).format('h:mm:ss a')}
							</div>
						</div>

						<div class="stat p-2">
							<div class="stat-title text-sm">Last Updated</div>
							<div class="stat-value text-info text-sm">
								{moment(UserStore.user.updated_at).format('MMMM Do YYYY')}
							</div>
							<div class="stat-desc text-xs">
								{moment(UserStore.user.updated_at).format('h:mm:ss a')}
							</div>
						</div>
					</div>
					<div class="card-actions justify-end">
						<!-- // goto the logout page -->
						<button
							class="btn btn-primary"
							onclick={() => {
								goto('/logout');
							}}>Logout</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div
		role="alert"
		class="alert alert-error"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 shrink-0 stroke-current"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
		<span>Error! Unable to load user data.</span>
	</div>
{/if}
