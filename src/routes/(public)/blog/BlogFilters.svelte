<script lang="ts">
	import MultiUserSelect from '$lib/components/MultiUserSelect.svelte';
	import Select from '$lib/components/Select.svelte';
	import type { User } from '$lib/types/user';

	type Props = {
		search: string;
		authors: string;
		public_status: string;
		initial_users: User[];
		has_session: boolean;
		on_search: (event: Event) => void;
		on_filter_change: () => void;
		on_clear_all: () => void;
	};

	let {
		search = $bindable(),
		authors = $bindable(),
		public_status = $bindable(),
		initial_users,
		has_session,
		on_search,
		on_filter_change,
		on_clear_all
	}: Props = $props();

	// Initialize with the resolved users from SSR using an overridable derived
	let selected_users = $derived(initial_users || []);

	function handle_users_change() {
		authors = selected_users.map((u) => u.user_id).join(',');
		on_filter_change();
	}

	let has_active_filters = $derived(!!(search || authors || public_status));

	const status_options = [
		{ value: '', label: 'All Statuses' },
		{ value: 'true', label: 'Published' },
		{ value: 'false', label: 'Drafts' }
	];
</script>

<section class="card bg-base-100 border-base-content/10 border">
	<div class="card-body gap-4 p-4">
		<div class="flex flex-col gap-4 lg:flex-row">
			<div class="flex-1">
				<input
					type="text"
					placeholder="Search posts..."
					class="input w-full"
					bind:value={search}
					oninput={on_search}
				/>
			</div>

			<div class="flex-1">
				<MultiUserSelect
					bind:selected_users
					placeholder="Filter by author..."
					onchange={handle_users_change}
				/>
			</div>

			{#if has_session}
				<div class="w-full lg:w-48">
					<Select
						options={status_options}
						bind:value={public_status}
						onchange={on_filter_change}
					/>
				</div>
			{/if}

			{#if has_active_filters}
				<div class="flex items-center">
					<button
						type="button"
						class="btn btn-ghost text-error w-full lg:w-auto"
						onclick={() => {
							selected_users = [];
							on_clear_all();
						}}
					>
						Clear
					</button>
				</div>
			{/if}
		</div>
	</div>
</section>
