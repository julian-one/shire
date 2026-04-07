<script lang="ts">
	import { goto } from '$app/navigation';
	import { deserialize } from '$app/forms';
	import { page } from '$app/state';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { type Role } from '$lib/types/user';
	import type { Session } from '$lib/types/session';
	import type { OrderBy } from '$lib/types/database';
	import Pagination from '$lib/components/Pagination.svelte';

	import UserHeader from './UserHeader.svelte';
	import UserFilters from './UserFilters.svelte';
	import UserTable from './UserTable.svelte';

	let { data } = $props();

	let users = $derived(data.users);

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

	let search = $derived(data.search);
	let selected_role = $derived(data.role);

	let timer: ReturnType<typeof setTimeout>;

	function apply_now() {
		const u = new URL(page.url);

		if (search && search !== data.defaults.search) u.searchParams.set('search', search);
		else u.searchParams.delete('search');

		if (selected_role && selected_role !== data.defaults.role) u.searchParams.set('role', selected_role);
		else u.searchParams.delete('role');

		const current_order_by = sort_criteria.map((c) => `${c.column}:${c.order}`).join(',');
		if (current_order_by && current_order_by !== data.defaults.order_by) {
			u.searchParams.set('order_by', current_order_by);
		} else {
			u.searchParams.delete('order_by');
		}

		u.searchParams.delete('offset');
		goto(u, { keepFocus: true, noScroll: true, replaceState: true });
	}

	function trigger_update() {
		clearTimeout(timer);
		timer = setTimeout(apply_now, 300);
	}

	async function load_user_session(user_id: string) {
		const form = new FormData();
		form.set('user_id', user_id);

		try {
			const response = await fetch('?/list_sessions', { method: 'POST', body: form });
			const result = deserialize(await response.text());
			if (result.type === 'success' && result.data) {
				const sessions = result.data.sessions as Session[];
				user_sessions[user_id] = sessions && sessions.length > 0 ? sessions : null;
			} else {
				AlertStore.add('Failed to load user sessions', 'error');
				user_sessions[user_id] = null;
			}
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

		const form = new FormData();
		form.set('session_id', session_id);

		try {
			const response = await fetch('?/revoke_session', { method: 'POST', body: form });
			const result = deserialize(await response.text());

			if (result.type === 'success') {
				// If we revoked our own session, redirect to login
				if (session_id === data.session?.session_id) {
					goto('/login');
					return;
				}

				AlertStore.add('Session revoked successfully', 'success');
				expanded_user_ids.forEach((user_id) => load_user_session(user_id));
			} else {
				AlertStore.add('Failed to revoke session', 'error');
			}
		} catch {
			AlertStore.add('Failed to revoke session', 'error');
		}
	}

	async function handle_revoke_all_sessions(user_id: string) {
		if (!confirm('Are you sure you want to revoke all sessions for this user?')) return;
		if (!user_id) return;

		const form = new FormData();
		form.set('user_id', user_id);

		try {
			const response = await fetch('?/revoke_all_sessions', { method: 'POST', body: form });
			const result = deserialize(await response.text());

			if (result.type === 'success') {
				// If we revoked our own sessions, redirect to login
				if (user_id === data.user?.user_id) {
					goto('/login');
					return;
				}

				AlertStore.add('All sessions revoked successfully', 'success');
				load_user_session(user_id);
			} else {
				AlertStore.add('Failed to revoke all sessions', 'error');
			}
		} catch {
			AlertStore.add('Failed to revoke all sessions', 'error');
		}
	}

	async function handle_update_role(user_id: string, role: Role) {
		const form = new FormData();
		form.set('user_id', user_id);
		form.set('role', role);

		try {
			const response = await fetch('?/update_role', { method: 'POST', body: form });
			const result = deserialize(await response.text());

			if (result.type === 'success') {
				users = users.map((u) => (u.user_id === user_id ? { ...u, role } : u));
				AlertStore.add('Role updated successfully', 'success');
			} else {
				AlertStore.add('Failed to update role', 'error');
			}
		} catch {
			AlertStore.add('Failed to update role', 'error');
		}
	}

	function toggle_sort(column: string, event: MouseEvent) {
		const is_shift = event.shiftKey;
		const existing_index = sort_criteria.findIndex((c) => c.column === column);
		let new_criteria: OrderBy[];

		if (existing_index !== -1) {
			const current = sort_criteria[existing_index];
			const new_direction = current.order === 'asc' ? 'desc' : 'asc';

			if (is_shift) {
				new_criteria = [...sort_criteria];
				new_criteria[existing_index] = { column, order: new_direction };
			} else {
				new_criteria = [{ column, order: new_direction }];
			}
		} else {
			if (is_shift) {
				new_criteria = [...sort_criteria, { column, order: 'asc' }];
			} else {
				new_criteria = [{ column, order: 'asc' }];
			}
		}

		sort_criteria = new_criteria; // Need to temporarily update sort_criteria for apply map parsing
		apply_now();
	}
</script>

<div class="space-y-6 pb-8 md:pb-12">
	<UserHeader total_users={data.total} />

	<UserFilters
		bind:search
		bind:selected_role
		on_search={trigger_update}
		on_role_change={apply_now}
	/>

	{#if data.error}
		<div class="alert alert-error">
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
		{users}
		{expanded_user_ids}
		{sort_criteria}
		{user_sessions}
		on_toggle_sort={toggle_sort}
		on_toggle_expansion={toggle_user_expansion}
		on_update_role={handle_update_role}
		on_revoke_session={handle_revoke_session}
		on_revoke_all={handle_revoke_all_sessions}
	/>

	<Pagination
		total={data.total}
		limit={data.limit}
		offset={data.offset}
	/>
</div>
