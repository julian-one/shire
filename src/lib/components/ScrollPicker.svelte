<script lang="ts">
	let {
		max,
		label,
		value = $bindable(0)
	} = $props<{
		max: number;
		label: string;
		value?: number;
	}>();

	const ITEM_HEIGHT = 36;
	const COPIES = 3;

	let container: HTMLDivElement;
	let settling = false;
	let timeout: ReturnType<typeof setTimeout>;

	function num_items() {
		return max + 1;
	}

	function scroll_to(val: number, instant = true) {
		if (!container) return;
		settling = true;
		const target = (num_items() + val) * ITEM_HEIGHT;
		container.scrollTo({ top: target, behavior: instant ? 'instant' : 'smooth' });
		setTimeout(() => (settling = false), 50);
	}

	function handle_scroll() {
		if (settling) return;

		const idx = Math.round(container.scrollTop / ITEM_HEIGHT);
		value = ((idx % num_items()) + num_items()) % num_items();

		clearTimeout(timeout);
		timeout = setTimeout(() => scroll_to(value), 150);
	}

	$effect(() => {
		if (container && !settling) {
			scroll_to(value);
		}
	});
</script>

<div class="relative flex w-14 flex-col items-center">
	<div class="bg-base-content/8 pointer-events-none absolute top-[36px] left-0 h-[36px] w-full rounded-md"></div>

	<div
		bind:this={container}
		class="relative z-10 h-[108px] w-full snap-y snap-mandatory overflow-y-scroll [scrollbar-width:none]"
		onscroll={handle_scroll}
	>
		<div class="h-[36px]"></div>

		{#each Array.from({ length: num_items() * COPIES }, (_, i) => i) as i (i)}
			{@const display_val = i % num_items()}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="flex h-[36px] cursor-pointer snap-center items-center justify-center tabular-nums {value === display_val
					? 'text-base-content text-lg font-bold'
					: 'text-base-content/30 text-sm'}"
				onclick={() => {
					if (!settling) {
						value = display_val;
						scroll_to(value, false);
					}
				}}
			>
				{display_val.toString().padStart(2, '0')}
			</div>
		{/each}

		<div class="h-[36px]"></div>
	</div>

	<span class="text-base-content/40 mt-1 text-[10px] font-semibold tracking-wider uppercase">{label}</span>
</div>
