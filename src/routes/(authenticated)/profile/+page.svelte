<script lang="ts">
	import { goto } from '$app/navigation';
	import moment from 'moment';
	import { AuthStore } from '$lib/stores/auth.svelte';
	import { RoleDisplay } from '$lib/types/user';

	let user = $derived(AuthStore.user);
</script>

{#if user}
	<div class="container mx-auto px-4 py-8">
		<div class="flex justify-center">
			<div class="card bg-base-100 w-full max-w-2xl shadow-xl">
				<div class="card-body">
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
{/if}
