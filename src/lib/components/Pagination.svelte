<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	type Props = {
		total: number;
		limit: number;
		offset: number;
	};

	let { total, limit, offset }: Props = $props();

	let current_page = $derived(Math.floor(offset / limit) + 1);
	let total_pages = $derived(Math.max(1, Math.ceil(total / limit)));

	function go_to_page(page_number: number) {
		const new_offset = (page_number - 1) * limit;
		const url = new URL(page.url);
		if (new_offset === 0) {
			url.searchParams.delete('offset');
		} else {
			url.searchParams.set('offset', String(new_offset));
		}
		goto(url.pathname + url.search, { replaceState: true, keepFocus: true, noScroll: false });
	}

	let visible_pages = $derived.by(() => {
		const pages: number[] = [];
		const start = Math.max(1, current_page - 2);
		const end = Math.min(total_pages, current_page + 2);
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}
		return pages;
	});

	let start_item = $derived(total === 0 ? 0 : offset + 1);
	let end_item = $derived(Math.min(offset + limit, total));
</script>

<div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
	<p class="text-base-content/60 text-sm">
		Showing {start_item}–{end_item} of {total}
	</p>

	<div class="join">
		<button
			class="join-item btn btn-sm"
			disabled={current_page <= 1}
			onclick={() => go_to_page(current_page - 1)}
			aria-label="Previous page"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="h-4 w-4"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15.75 19.5L8.25 12l7.5-7.5"
				/>
			</svg>
		</button>

		{#if visible_pages[0] > 1}
			<button
				class="join-item btn btn-sm"
				onclick={() => go_to_page(1)}>1</button
			>
			{#if visible_pages[0] > 2}
				<button class="join-item btn btn-sm btn-disabled">…</button>
			{/if}
		{/if}

		{#each visible_pages as p (p)}
			<button
				class="join-item btn btn-sm"
				class:btn-active={p === current_page}
				onclick={() => go_to_page(p)}
			>
				{p}
			</button>
		{/each}

		{#if visible_pages[visible_pages.length - 1] < total_pages}
			{#if visible_pages[visible_pages.length - 1] < total_pages - 1}
				<button class="join-item btn btn-sm btn-disabled">…</button>
			{/if}
			<button
				class="join-item btn btn-sm"
				onclick={() => go_to_page(total_pages)}
			>
				{total_pages}
			</button>
		{/if}

		<button
			class="join-item btn btn-sm"
			disabled={current_page >= total_pages}
			onclick={() => go_to_page(current_page + 1)}
			aria-label="Next page"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="h-4 w-4"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8.25 4.5l7.5 7.5-7.5 7.5"
				/>
			</svg>
		</button>
	</div>
</div>
