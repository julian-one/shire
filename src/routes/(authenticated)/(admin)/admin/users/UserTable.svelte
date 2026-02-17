<script lang="ts">
	import type { User, Role } from '$lib/types/user';
	import type { Session } from '$lib/types/session';
	import type { OrderBy } from '$lib/types/database';
	import UserTableRow from './UserTableRow.svelte';

	type Props = {
		users: Partial<User>[];
		expanded_user_ids: string[];
		sort_criteria: OrderBy[];
		user_sessions: Record<string, Session[] | null>;
		on_toggle_sort: (column: string, event: MouseEvent) => void;
		on_toggle_expansion: (user_id: string) => void;
		on_update_role: (user_id: string, role: Role) => void;
		on_revoke_session: (session_id: string) => void;
		on_revoke_all: (user_id: string) => void;
	};

	let {
		users,
		expanded_user_ids,
		sort_criteria,
		user_sessions,
		on_toggle_sort,
		on_toggle_expansion,
		on_update_role,
		on_revoke_session,
		on_revoke_all
	}: Props = $props();

	function get_sort_indicator(column: string) {
		const criteria = sort_criteria.find((c) => c.column === column);
		if (!criteria) return null;
		return criteria.order === 'asc' ? '↑' : '↓';
	}
</script>

<div class="rounded-box border-base-content/5 bg-base-100 overflow-x-auto border shadow-sm">
	<table class="table-md table">
		<thead>
			<tr class="bg-base-200/50">
				<th class="w-10"></th>
				<th
					class="cursor-pointer select-none"
					onclick={(e) => on_toggle_sort('username', e)}
				>
					<div class="flex gap-1">
						User
						{#if get_sort_indicator('username')}
							<span class="text-primary text-xs">{get_sort_indicator('username')}</span>
						{/if}
					</div>
				</th>
				<th
					class="cursor-pointer select-none"
					onclick={(e) => on_toggle_sort('role', e)}
				>
					<div class="flex gap-1">
						Role
						{#if get_sort_indicator('role')}
							<span class="text-primary text-xs">{get_sort_indicator('role')}</span>
						{/if}
					</div>
				</th>
				<th
					class="cursor-pointer select-none"
					onclick={(e) => on_toggle_sort('created_at', e)}
				>
					<div class="flex gap-1">
						Joined
						{#if get_sort_indicator('created_at')}
							<span class="text-primary text-xs">{get_sort_indicator('created_at')}</span>
						{/if}
					</div>
				</th>
			</tr>
		</thead>
		<tbody>
			{#each users as user, index (user.user_id ?? index)}
				<UserTableRow
					{user}
					is_expanded={expanded_user_ids.includes(user.user_id ?? '')}
					sessions={user.user_id ? user_sessions[user.user_id] : null}
					{on_toggle_expansion}
					{on_update_role}
					{on_revoke_session}
					{on_revoke_all}
				/>
			{/each}
		</tbody>
	</table>
</div>
