<script lang="ts">
	type Props = {
		search: string;
		my_posts: string;
		has_session: boolean;
		on_search: (event: Event) => void;
		on_filter_change: () => void;
		on_clear_all: () => void;
	};

	let {
		search = $bindable(),
		my_posts = $bindable(),
		has_session,
		on_search,
		on_filter_change,
		on_clear_all
	}: Props = $props();

	let has_active_filters = $derived(!!(search || my_posts));
</script>

<section class="card bg-base-100 border-base-content/10 border">
	<div class="card-body p-4">
		<div class="flex flex-col gap-4 lg:flex-row lg:items-center">
			<div class="flex-1">
				<input
					type="text"
					placeholder="Search posts..."
					class="input w-full"
					bind:value={search}
					oninput={on_search}
				/>
			</div>

			<div class="flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center">
				{#if has_session}
					<label class="flex w-full cursor-pointer items-center justify-between gap-2 px-2 py-1.5 sm:w-auto">
						<span class="text-sm font-medium">My Posts</span>
						<input
							type="checkbox"
							class="toggle toggle-sm"
							checked={my_posts === 'true'}
							onchange={(e) => {
								my_posts = e.currentTarget.checked ? 'true' : '';
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
