<script lang="ts">
	import { Role, RoleDisplay } from '$root/lib/types/user';

	type Props = {
		search: string;
		selected_role: string;
		on_search: (event: Event) => void;
		on_role_change?: () => void;
	};

	let { search = $bindable(), selected_role = $bindable(), on_search, on_role_change }: Props = $props();

	const role_options = [
		{ value: '', label: 'All Roles' },
		...Object.values(Role).map((value) => ({
			value,
			label: RoleDisplay.get(value) || value
		}))
	];
</script>

<section class="card bg-base-100 border-base-content/10 border">
	<div class="card-body p-4">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
			<div class="flex-1">
				<input
					type="text"
					placeholder="Search by username or email..."
					class="input w-full"
					bind:value={search}
					oninput={on_search}
				/>
			</div>

			<div class="w-full sm:w-48">
				<select
					class="select w-full"
					bind:value={selected_role}
					onchange={on_role_change}
				>
					{#each role_options as option (option.value)}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>
</section>
