<script lang="ts">
	import Select from '$lib/components/Select.svelte';
	import { Role, RoleDisplay } from '$root/lib/types/user';

	type Props = {
		search: string;
		selected_role: string;
		on_search: (event: Event) => void;
		on_clear: () => void;
	};

	let { search = $bindable(), selected_role = $bindable(), on_search, on_clear }: Props = $props();

	/*
    export const RoleDisplay = new Map<Role, string>([
      [Role.Admin, 'Admin'],
      [Role.User, 'User']
    ]);
  */
	const role_options = [
		{ value: '', label: 'All Roles' },
		{ value: Role.Admin, label: RoleDisplay.get(Role.Admin) || 'Admin' },
		{ value: Role.User, label: RoleDisplay.get(Role.User) || 'User' }
	];
</script>

<section class="card bg-base-100 border-base-content/5 border shadow-sm">
	<div class="card-body p-4">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
			<div class="relative flex-1">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 opacity-40"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle
							cx="11"
							cy="11"
							r="8"
						/>
						<path d="m21 21-4.3-4.3" />
					</svg>
				</div>
				<input
					type="text"
					placeholder="Search by username or email..."
					class="input input-bordered w-full pl-10"
					value={search}
					oninput={on_search}
				/>
			</div>

			<div class="w-full sm:w-48">
				<Select
					options={role_options}
					bind:value={selected_role}
					placeholder="Filter by Role"
				/>
			</div>

			<button
				class="btn btn-ghost btn-square"
				onclick={on_clear}
				aria-label="Clear filters"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
					<path d="M3 3v5h5" />
				</svg>
			</button>
		</div>
	</div>
</section>
