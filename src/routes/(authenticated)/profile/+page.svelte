<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { SessionStore } from '$lib/stores/session';
	import { UserController } from '$lib/controllers/user';
	import { type User, RoleDisplay } from '$lib/types/user';
	import moment from 'moment';

	let session = $derived($SessionStore);
	let user_controller = new UserController();
	let user: User | null = $state(null);

	onMount(async () => {
		if (session) {
			try {
				user = await user_controller.GetUser(session.user_id);
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		}
	});
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex justify-center">
		<div class="card bg-base-100 w-full max-w-2xl shadow-xl">
			<div class="card-body">
				{#if user}
					<h2 class="card-title mx-auto mb-4 w-fit text-3xl font-bold">{user.username}</h2>
					<div class="mb-2 text-lg">
						<p><span class="font-semibold">Email:</span> {user.email}</p>
					</div>
					<div class="mb-4 text-lg">
						<p><span class="font-semibold">ID:</span> {user.user_id}</p>
					</div>

					<div class="stats lg:stats-horizontal mb-6 w-full shadow">
						<div class="stat p-2">
							<div class="stat-title text-sm">Role</div>
							<div class="stat-value text-secondary text-sm">{RoleDisplay.get(user.role)}</div>
						</div>

						<div class="stat p-2">
							<div class="stat-title text-sm">Member Since</div>
							<div class="stat-value text-accent text-sm">
								{moment(user.created_at).format('MMMM Do YYYY')}
							</div>
							<div class="stat-desc text-xs">
								{moment(user.created_at).format('h:mm:ss a')}
							</div>
						</div>

						<div class="stat p-2">
							<div class="stat-title text-sm">Last Updated</div>
							<div class="stat-value text-info text-sm">
								{moment(user.updated_at).format('MMMM Do YYYY')}
							</div>
							<div class="stat-desc text-xs">
								{moment(user.updated_at).format('h:mm:ss a')}
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
				{:else}
					<div class="flex w-full flex-col gap-4">
						<div class="skeleton mx-auto h-8 w-1/2"></div>
						<!-- For username -->
						<div class="skeleton h-6 w-11/12"></div>
						<!-- For email -->
						<div class="skeleton h-6 w-9/12"></div>
						<!-- For user ID -->
						<div class="stats lg:stats-horizontal w-full shadow">
							<div class="stat p-2">
								<div class="skeleton mb-2 h-4 w-3/4"></div>
								<div class="skeleton h-5 w-full"></div>
							</div>
							<div class="stat p-2">
								<div class="skeleton mb-2 h-4 w-3/4"></div>
								<div class="skeleton h-5 w-full"></div>
								<div class="skeleton mt-1 h-3 w-1/2"></div>
							</div>
							<div class="stat p-2">
								<div class="skeleton mb-2 h-4 w-3/4"></div>
								<div class="skeleton h-5 w-full"></div>
								<div class="skeleton mt-1 h-3 w-1/2"></div>
							</div>
						</div>
						<div class="skeleton h-12 w-1/4 self-end"></div>
						<!-- For logout button -->
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
