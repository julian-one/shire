<script lang="ts">
	type Props = {
		label: string;
		field: string;
		order_by: string;
		on_sort: (value: string) => void;
		class?: string;
	};

	let { label, field, order_by, on_sort, class: class_name = '' }: Props = $props();

	let direction = $derived.by(() => {
		if (order_by === `${field}:asc`) return 'asc';
		if (order_by === `${field}:desc`) return 'desc';
		return '';
	});

	function handle_click() {
		if (direction === '') {
			on_sort(`${field}:asc`);
		} else if (direction === 'asc') {
			on_sort(`${field}:desc`);
		} else {
			on_sort('');
		}
	}
</script>

<th class={class_name}>
	<button
		type="button"
		class="flex w-full cursor-pointer items-center gap-1"
		onclick={handle_click}
	>
		{label}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke="currentColor"
			class="text-base-content/40 h-3 w-3 shrink-0"
			class:text-base-content={direction !== ''}
		>
			{#if direction === 'asc'}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M4.5 15.75l7.5-7.5 7.5 7.5"
				/>
			{:else if direction === 'desc'}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M19.5 8.25l-7.5 7.5-7.5-7.5"
				/>
			{:else}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
				/>
			{/if}
		</svg>
	</button>
</th>
