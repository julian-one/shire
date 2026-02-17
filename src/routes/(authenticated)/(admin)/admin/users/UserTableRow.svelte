<script lang="ts">
	import moment from 'moment';
	import type { User } from '$lib/types/user';
	import { Role } from '$root/lib/types/user';
	import type { Session } from '$lib/types/session';
	import SessionTable from './SessionTable.svelte';

	type Props = {
		user: Partial<User>;
		is_expanded: boolean;
		sessions: Session[] | null | undefined;
		on_toggle_expansion: (user_id: string) => void;
		on_update_role: (user_id: string, role: Role) => void;
		on_revoke_session: (session_id: string) => void;
		on_revoke_all: (user_id: string) => void;
	};

	let { user, is_expanded, sessions, on_toggle_expansion, on_update_role, on_revoke_session, on_revoke_all }: Props =
		$props();

	let is_admin = $derived(user.role === Role.Admin);

	function handle_toggle_role() {
		if (user.user_id) {
			on_update_role(user.user_id, is_admin ? Role.User : Role.Admin);
		}
	}
</script>

{#if user.user_id}
	{@const user_id = user.user_id}
	<tr
		class="hover transition-colors {is_expanded ? 'bg-base-200/50' : ''}"
		onclick={() => on_toggle_expansion(user_id)}
	>
		<td>
			<button
				class="btn btn-ghost btn-xs btn-square transition-transform {is_expanded ? 'rotate-90' : ''}"
				aria-label={is_expanded ? 'Collapse user details' : 'Expand user details'}
			>
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
				>
					<path d="m9 18 6-6-6-6" />
				</svg>
			</button>
		</td>
		<td>
			<div class="flex items-center gap-2">
				<div class="avatar placeholder">
					<div class="bg-neutral text-neutral-content flex h-7 w-7 items-center justify-center rounded-full">
						<span class="text-xs uppercase">{user.username?.substring(0, 2)}</span>
					</div>
				</div>
				<div class="min-w-0">
					<div class="truncate text-sm font-bold">{user.username}</div>
					<div class="truncate text-xs opacity-50">{user.email}</div>
				</div>
			</div>
		</td>
		<td onclick={(e: MouseEvent) => e.stopPropagation()}>
			<label class="label gap-2">
				<input
					type="checkbox"
					class="toggle"
					checked={is_admin}
					onchange={handle_toggle_role}
				/>
				{is_admin ? 'Admin' : 'User'}
			</label>
		</td>
		<td>
			<div class="text-sm">{moment(user.created_at).format('ll')}</div>
			<div class="text-xs opacity-40">{moment(user.created_at).fromNow()}</div>
		</td>
	</tr>
	{#if is_expanded}
		<tr>
			<td
				colspan="4"
				class="bg-base-200/30 p-0"
			>
				<SessionTable
					{sessions}
					{user_id}
					{on_revoke_session}
					{on_revoke_all}
				/>
			</td>
		</tr>
	{/if}
{/if}
