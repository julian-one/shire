<script lang="ts">
	import { onMount } from 'svelte';
	import moment from 'moment';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { UserListStore } from '$lib/stores/users.svelte';
	import { UserController } from '$root/lib/controllers/user';
	import { RoleDisplay } from '$root/lib/types/user';

	let user_controller = new UserController();

	async function load_users() {
		try {
			UserListStore.users = await user_controller.List();
		} catch {
			AlertStore.add('Failed to load user list', 'error');
		}
	}

	onMount(() => {
		load_users();
	});
</script>

<div class="rounded-box border-base-content/5 bg-base-100 overflow-x-auto border">
	<table class="table">
		<thead>
			<tr>
				<th></th>
				<th>ID</th>
				<th>Username</th>
				<th>Email</th>
				<th>Role</th>
				<th>Member Since</th>
				<th>Last Updated</th>
			</tr>
		</thead>
		<tbody>
			{#each UserListStore.users as user, index (user.user_id)}
				<tr>
					<th>{index + 1}</th>
					<td>{user.user_id}</td>
					<td>{user.username}</td>
					<td>{user.email}</td>
					<td>{user?.role ? RoleDisplay.get(user.role) : 'N/A'}</td>
					<td>{moment(user.created_at).format('MMMM Do YYYY')}</td>
					<td>{moment(user.updated_at).format('MMMM Do YYYY')}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
