<script lang="ts">
	type Option = {
		value: string;
		label: string;
	};

	type Props = {
		options: Option[];
		value: string;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
	};

	let {
		options,
		value = $bindable(),
		placeholder = 'Select...',
		disabled = false,
		class: className = ''
	}: Props = $props();

	let open = $state(false);
	let container: HTMLDivElement;

	let selected_label = $derived(options.find((o) => o.value === value)?.label ?? placeholder);

	function select(option: Option) {
		value = option.value;
		open = false;
	}

	function handle_keydown(event: KeyboardEvent, option: Option) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			select(option);
		}
	}

	function handle_click_outside(event: MouseEvent) {
		if (open && container && !container.contains(event.target as Node)) {
			open = false;
		}
	}
</script>

<svelte:window onclick={handle_click_outside} />

<div
	bind:this={container}
	class="dropdown select-dropdown w-full {className}"
	class:dropdown-open={open}
>
	<button
		type="button"
		tabindex="0"
		class="select select-bordered w-full bg-none [&]:pr-3"
		{disabled}
		onclick={() => (open = !open)}
	>
		<span class="flex-1 truncate text-left {!value ? 'opacity-50' : ''}">{selected_label}</span>
		<svg
			class="h-4 w-4 shrink-0 transition-transform"
			class:rotate-180={open}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>
	<ul
		tabindex="-1"
		class="dropdown-content menu bg-base-100 rounded-box z-1 max-h-60 w-full flex-col flex-nowrap overflow-y-auto p-2 shadow-sm"
	>
		{#each options as option (option.value)}
			<li class="w-full">
				<button
					type="button"
					class={option.value === value ? 'menu-active' : ''}
					onclick={() => select(option)}
					onkeydown={(e) => handle_keydown(e, option)}
				>
					{option.label}
				</button>
			</li>
		{/each}
	</ul>
</div>
