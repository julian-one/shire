<script lang="ts">
	import { Cuisine, Category } from '$lib/types/recipe';

	type Props = {
		search: string;
		cuisine: string;
		category: string;
		bookmarks: string;
		has_session: boolean;
		on_search: (event: Event) => void;
		on_filter_change: () => void;
		on_clear_all: () => void;
	};

	let {
		search = $bindable(),
		cuisine = $bindable(),
		category = $bindable(),
		bookmarks = $bindable(),
		has_session,
		on_search,
		on_filter_change,
		on_clear_all
	}: Props = $props();

	const cuisine_options = [
		{ value: '', label: 'All Cuisines' },
		...Object.values(Cuisine).map((c) => ({ value: c, label: c }))
	];

	const category_options = [
		{ value: '', label: 'All Categories' },
		...Object.values(Category).map((c) => ({ value: c, label: c }))
	];

	let has_active_filters = $derived(!!(cuisine || category || bookmarks));
</script>

<section class="card bg-base-100 border-base-content/10 border">
	<div class="card-body p-4">
		<div class="flex flex-col gap-4 lg:flex-row lg:items-center">
			<div class="flex-1">
				<input
					type="text"
					placeholder="Search recipes..."
					class="input w-full"
					bind:value={search}
					oninput={on_search}
				/>
			</div>

			<div class="flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center">
				<div class="w-full sm:w-48">
					<select
						class="select w-full"
						bind:value={cuisine}
						onchange={on_filter_change}
					>
						{#each cuisine_options as option (option.value)}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>

				<div class="w-full sm:w-48">
					<select
						class="select w-full"
						bind:value={category}
						onchange={on_filter_change}
					>
						{#each category_options as option (option.value)}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>

				{#if has_session}
					<label class="flex w-full cursor-pointer items-center justify-between gap-2 px-2 py-1.5 sm:w-auto">
						<span class="text-sm font-medium">Bookmarks</span>
						<input
							type="checkbox"
							class="toggle toggle-sm"
							checked={bookmarks === 'true'}
							onchange={(e) => {
								bookmarks = e.currentTarget.checked ? 'true' : '';
								on_filter_change();
							}}
						/>
					</label>
				{/if}

				{#if has_active_filters}
					<button
						type="button"
						class="btn btn-ghost text-error w-full sm:w-auto"
						onclick={on_clear_all}
					>
						Clear
					</button>
				{/if}
			</div>
		</div>
	</div>
</section>
