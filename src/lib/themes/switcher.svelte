<script lang="ts">
	import { themes } from './options';

	let { theme = $bindable() } = $props();

	function selectTheme(t: string) {
		theme = t;
	}

	$effect(() => {
		if (theme) {
			document.documentElement.setAttribute('data-theme', theme);
			document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
		}
	});
</script>

<div class="dropdown dropdown-end">
	<div
		tabindex="0"
		role="button"
		class="btn btn-ghost"
	>
		<svg
			width="20"
			height="20"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="h-5 w-5 stroke-current"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-8.486 8.486L11 7.343z"
			></path>
		</svg>
		<span class="hidden font-normal md:inline">Theme</span>
		<svg
			width="12.3"
			height="12.3"
			class="hidden h-2 w-2 fill-current opacity-60 sm:inline-block"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 2048 2048"
		>
			<path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
		</svg>
	</div>
	<div
		class="dropdown-content bg-base-200 text-base-content rounded-box top-px mt-16 h-[28.5rem] max-h-[calc(100vh-10rem)] w-56 overflow-y-auto border border-white/5 shadow-2xl outline outline-1 outline-black/5"
	>
		<ul class="menu menu-sm p-2">
			{#each themes as t (t)}
				<li>
					<button
						class="flex gap-3 {theme === t ? 'active' : ''}"
						onclick={() => selectTheme(t)}
					>
						<div
							data-theme={t}
							class="bg-base-100 grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-sm"
						>
							<div class="bg-base-content size-1 rounded-full"></div>
							<div class="bg-primary size-1 rounded-full"></div>
							<div class="bg-secondary size-1 rounded-full"></div>
							<div class="bg-accent size-1 rounded-full"></div>
						</div>
						<div class="flex-1 truncate">{t}</div>
						{#if theme === t}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="h-3 w-3 shrink-0"
							>
								<path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
							</svg>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	</div>
</div>
