<script lang="ts">
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { UserListStore } from '$lib/stores/users.svelte';
	import { AuthController } from '$lib/controllers/auth';
	import { UserController } from '$lib/controllers/user';
	import { type Role } from '$lib/types/user';
	import type { Session } from '$lib/types/session';
	import type { OrderBy } from '$lib/types/database';

	import UserHeader from './UserHeader.svelte';
	import UserFilters from './UserFilters.svelte';
	import UserTable from './UserTable.svelte';

	let { data } = $props();

	const auth_controller = new AuthController();
	const user_controller = new UserController();

	// Synchronize store with server data
	$effect(() => {
		UserListStore.users = data.users;
	});

	let user_sessions = $state<Record<string, Session[] | null>>({});
	let expanded_user_ids = $state<string[]>([]);

	// Parse sort criteria from URL or use default
	let sort_criteria = $derived.by<OrderBy[]>(() => {
		const order_by = page.url.searchParams.get('order_by') || 'created_at:desc';
		return order_by.split(',').map((part) => {
			const [column, order] = part.split(':');
			return { column, order: order as 'asc' | 'desc' };
		});
	});

	// Initialize state. We use an effect to keep it in sync with data,
	// which is the idiomatic way to handle "initial value from prop" without warnings.
	let search = $state('');
	let selected_role = $state('');

	// Sync local state when data changes (e.g. back button or direct URL change)
	$effect(() => {
		search = data.search;
		selected_role = data.role;
	});

	// Update URL when filters change
	let debounce_timer: NodeJS.Timeout;
	function update_url() {
		const params = new SvelteURLSearchParams(page.url.searchParams);
		if (search) params.set('search', search);
		else params.delete('search');

		if (selected_role) params.set('role', selected_role);
		else params.delete('role');

		// Keep current sort
		const order_by = page.url.searchParams.get('order_by');
		if (order_by) params.set('order_by', order_by);

		goto(`?${params.toString()}`, { replaceState: true, keepFocus: true, noScroll: true });
	}

	async function load_user_session(user_id: string) {
		try {
			const sessions = await auth_controller.ListSessions(user_id);
			// If sessions is empty, we store null to indicate "no sessions" (vs undefined for "loading")
			user_sessions[user_id] = sessions && sessions.length > 0 ? sessions : null;
		} catch {
			AlertStore.add('Failed to load user sessions', 'error');
			user_sessions[user_id] = null;
		}
	}

	function toggle_user_expansion(user_id: string) {
		if (expanded_user_ids.includes(user_id)) {
			expanded_user_ids = expanded_user_ids.filter((id) => id !== user_id);
		} else {
			expanded_user_ids = [...expanded_user_ids, user_id];
			if (user_sessions[user_id] === undefined) {
				load_user_session(user_id);
			}
		}
	}

	async function handle_revoke_session(session_id: string) {
		if (!confirm('Are you sure you want to revoke this session?')) return;
		if (!session_id) return;

		try {
			await auth_controller.DeleteSession(session_id);

			// If we revoked our own session, redirect to login
			if (session_id === data.session?.session_id) {
				goto('/login');
				return;
			}

			AlertStore.add('Session revoked successfully', 'success');
			// Refresh sessions for all expanded users
			expanded_user_ids.forEach((user_id) => load_user_session(user_id));
		} catch {
			AlertStore.add('Failed to revoke session', 'error');
		}
	}

	async function handle_revoke_all_sessions(user_id: string) {
		if (!confirm('Are you sure you want to revoke all sessions for this user?')) return;
		if (!user_id) return;

		try {
			await auth_controller.DeleteAllSessions(user_id);

			// If we revoked our own sessions, redirect to login
			if (user_id === data.user?.user_id) {
				goto('/login');
				return;
			}

			AlertStore.add('All sessions revoked successfully', 'success');
			// Refresh sessions for the user
			load_user_session(user_id);
		} catch {
			AlertStore.add('Failed to revoke all sessions', 'error');
		}
	}

	async function handle_update_role(user_id: string, role: Role) {
		try {
			await user_controller.UpdateRole(user_id, role);
			UserListStore.update({ user_id, role });
			AlertStore.add('Role updated successfully', 'success');
		} catch {
			AlertStore.add('Failed to update role', 'error');
		}
	}

	function handle_search(event: Event) {
		search = (event.target as HTMLInputElement).value;
		clearTimeout(debounce_timer);
		debounce_timer = setTimeout(update_url, 300);
	}

	function handle_clear_filters() {
		search = '';
		selected_role = '';
		update_url();
	}

	// Reactive loading when role changes via Select component
	$effect(() => {
		// Only update URL if the change came from the UI (different from current data)
		if (selected_role !== data.role && selected_role !== '') {
			update_url();
		}
	});

	function toggle_sort(column: string, event: MouseEvent) {
		const isShift = event.shiftKey;
		const existingIndex = sort_criteria.findIndex((c) => c.column === column);
		let new_criteria: OrderBy[];

		if (existingIndex !== -1) {
			const current = sort_criteria[existingIndex];
			const new_direction = current.order === 'asc' ? 'desc' : 'asc';

			if (isShift) {
				new_criteria = [...sort_criteria];
				new_criteria[existingIndex] = { column, order: new_direction };
			} else {
				new_criteria = [{ column, order: new_direction }];
			}
		} else {
			if (isShift) {
				new_criteria = [...sort_criteria, { column, order: 'asc' }];
			} else {
				new_criteria = [{ column, order: 'asc' }];
			}
		}

		const order_by_str = new_criteria.map((c) => `${c.column}:${c.order}`).join(',');
		const params = new SvelteURLSearchParams(page.url.searchParams);
		params.set('order_by', order_by_str);
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}
</script>

<div class="space-y-6">
	<UserHeader total_users={UserListStore.users.length} />

	<UserFilters
		bind:search
		bind:selected_role
		on_search={handle_search}
		on_clear={handle_clear_filters}
	/>

	{#if data.error}
		<div class="alert alert-error shadow-sm">
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
			<span>{data.error}</span>
		</div>
	{/if}

	<UserTable
		users={UserListStore.users}
		{expanded_user_ids}
		{sort_criteria}
		{user_sessions}
		on_toggle_sort={toggle_sort}
		on_toggle_expansion={toggle_user_expansion}
		on_update_role={handle_update_role}
		on_revoke_session={handle_revoke_session}
		on_revoke_all={handle_revoke_all_sessions}
	/>
</div>
