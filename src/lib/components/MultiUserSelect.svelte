<script lang="ts">
	import { UserController } from '$lib/controllers/user';
	import type { User } from '$lib/types/user';

	type Props = {
		selected_users: User[];
		placeholder?: string;
		onchange?: () => void;
	};

	let { selected_users = $bindable([]), placeholder = 'Search users...', onchange }: Props = $props();

	let query = $state('');
	let options = $state<User[]>([]);
	let is_open = $state(false);
	let is_loading = $state(false);
	let container: HTMLDivElement;
	let input_element: HTMLInputElement;

	let debounce_timer: ReturnType<typeof setTimeout>;

	const user_controller = new UserController();

	async function perform_search(search: string) {
		if (!search.trim()) {
			options = [];
			is_open = false;
			return;
		}

		is_loading = true;
		try {
			const result = await user_controller.list({ search, limit: 10 });
			// Filter out already selected users
			options = result.items.filter((u) => !selected_users.some((selected) => selected.user_id === u.user_id));
			is_open = options.length > 0;
		} catch {
			// ignore
		} finally {
			is_loading = false;
		}
	}

	function handle_input() {
		clearTimeout(debounce_timer);
		if (!query) {
			options = [];
			is_open = false;
			return;
		}
		debounce_timer = setTimeout(() => {
			perform_search(query);
		}, 300);
	}

	function select_user(user: User) {
		if (!selected_users.some((u) => u.user_id === user.user_id)) {
			selected_users = [...selected_users, user];
			onchange?.();
		}
		query = '';
		options = [];
		is_open = false;
		input_element.focus();
	}

	function remove_user(user_id: string) {
		selected_users = selected_users.filter((u) => u.user_id !== user_id);
		onchange?.();
	}

	function handle_keydown(e: KeyboardEvent, user?: User) {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (user) select_user(user);
			else if (options.length > 0) select_user(options[0]);
		} else if (e.key === 'Backspace' && query === '' && selected_users.length > 0) {
			remove_user(selected_users[selected_users.length - 1].user_id);
		} else if (e.key === 'Escape') {
			is_open = false;
		}
	}

	function handle_click_outside(event: MouseEvent) {
		if (is_open && container && !container.contains(event.target as Node)) {
			is_open = false;
		}
	}
</script>

<svelte:window onclick={handle_click_outside} />

<div
	class="relative w-full"
	bind:this={container}
>
	<div
		class="input focus-within:outline-base-content/20 flex w-full flex-wrap items-center gap-1.5 px-3 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 {selected_users.length >
		0
			? 'h-auto min-h-12 py-1.5'
			: ''}"
	>
		{#each selected_users as user (user.user_id)}
			<div class="badge badge-neutral h-7 gap-1">
				{user.username}
				<button
					type="button"
					class="btn btn-ghost btn-xs btn-circle hover:bg-base-content/20 ml-1 h-4 min-h-0 w-4"
					onclick={() => remove_user(user.user_id)}
					aria-label="Remove {user.username}"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-3 w-3"
					>
						<path
							d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
						/>
					</svg>
				</button>
			</div>
		{/each}

		<input
			bind:this={input_element}
			type="text"
			class="min-w-[120px] flex-1 bg-transparent p-0 px-1 outline-none"
			{placeholder}
			bind:value={query}
			oninput={handle_input}
			onkeydown={handle_keydown}
			onfocus={() => {
				if (query) perform_search(query);
			}}
		/>
		{#if is_loading}
			<span class="loading loading-spinner loading-sm text-base-content/50 mx-2"></span>
		{/if}
	</div>

	{#if is_open}
		<ul
			tabindex="-1"
			class="dropdown-content menu bg-base-100 rounded-box border-base-content/10 absolute z-10 mt-1 max-h-60 w-full flex-col flex-nowrap overflow-y-auto border p-2 shadow-lg"
		>
			{#each options as option (option.user_id)}
				<li class="w-full">
					<button
						type="button"
						onclick={() => select_user(option)}
						onkeydown={(e) => handle_keydown(e, option)}
					>
						<div class="flex flex-col items-start">
							<span class="font-medium">{option.username}</span>
							<span class="text-base-content/60 text-xs">{option.email}</span>
						</div>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
