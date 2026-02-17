<script lang="ts">
	import moment from 'moment';
	import type { Session } from '$lib/types/session';

	type Props = {
		sessions: Session[] | null | undefined;
		user_id: string;
		on_revoke_session: (session_id: string) => void;
		on_revoke_all: (user_id: string) => void;
	};

	let { sessions, user_id, on_revoke_session, on_revoke_all }: Props = $props();
</script>

<div class="p-6">
	<div class="mb-4 flex items-center justify-between">
		<h4 class="flex items-center gap-2 text-sm font-semibold">
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
				<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
				<circle
					cx="12"
					cy="7"
					r="4"
				/>
			</svg>
			Active Sessions
		</h4>
		{#if sessions && sessions.length > 0}
			<button
				class="btn btn-outline btn-error btn-xs"
				onclick={() => on_revoke_all(user_id)}
			>
				Revoke All
			</button>
		{/if}
	</div>

	{#if sessions === undefined}
		<div class="flex flex-col items-center justify-center gap-2 py-8">
			<span class="loading loading-spinner loading-md text-primary"></span>
			<span class="text-xs opacity-50">Loading sessions...</span>
		</div>
	{:else if sessions === null || sessions.length === 0}
		<div class="bg-base-100/50 border-base-content/10 rounded-lg border border-dashed py-8 text-center">
			<p class="text-sm opacity-50">No active sessions found for this user.</p>
		</div>
	{:else}
		<div class="border-base-content/10 bg-base-100 overflow-hidden rounded-lg border shadow-sm">
			<table class="table-xs table-zebra table w-full">
				<thead class="bg-base-200/30">
					<tr>
						<th>Created</th>
						<th>Expires</th>
						<th>Status</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each sessions as session (session.session_id)}
						{@const is_expired = moment(session.expires_at).isBefore(moment())}
						<tr>
							<td>
								<div class="font-medium">
									{moment(session.created_at).format('MMM D, YYYY')}
								</div>
								<div class="text-[10px] opacity-40">
									{moment(session.created_at).format('HH:mm:ss')}
								</div>
							</td>
							<td>
								<div class="font-medium">
									{moment(session.expires_at).format('MMM D, YYYY')}
								</div>
								<div class="text-[10px] opacity-40">
									{moment(session.expires_at).fromNow()}
								</div>
							</td>
							<td>
								{#if is_expired}
									<div class="badge badge-error badge-outline h-4 text-[10px]">Expired</div>
								{:else}
									<div class="badge badge-success text-success-content h-4 text-[10px]">Active</div>
								{/if}
							</td>
							<td class="text-right">
								<button
									class="btn btn-ghost btn-xs text-error"
									onclick={() => on_revoke_session(session.session_id)}
								>
									Revoke
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
