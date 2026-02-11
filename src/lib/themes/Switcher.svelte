<script lang="ts">
	import { themes } from './options';

	let { theme = $bindable() } = $props();

	$effect(() => {
		if (theme) {
			document.documentElement.setAttribute('data-theme', theme);
			document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
		}
	});
</script>

<div
	class="dropdown dropdown-end tooltip tooltip-bottom"
	data-tip="Change Theme"
>
	<div
		tabindex="0"
		role="button"
		class="btn group btn-ghost btn-sm gap-1.5 px-1.5"
		aria-label="Change Theme"
	>
		<div
			class="border-base-content/10 group-hover:border-base-content/20 bg-base-100 grid shrink-0 grid-cols-2 gap-0.5 rounded-md border p-1 transition-colors"
		>
			<div class="bg-base-content size-1 rounded-full"></div>
			<div class="bg-primary size-1 rounded-full"></div>
			<div class="bg-secondary size-1 rounded-full"></div>
			<div class="bg-accent size-1 rounded-full"></div>
		</div>
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
		class="dropdown-content bg-base-200 text-base-content rounded-box top-px mt-16 h-122 max-h-[calc(100vh-8.6rem)] overflow-y-auto border border-white/5 shadow-2xl outline outline-black/5"
	>
		<ul class="menu w-56 p-2">
			<li class="menu-title text-xs">Theme</li>
			{#each themes as t (t)}
				<li>
					<button
						class="flex gap-3 px-2 {theme === t ? 'active' : ''}"
						onclick={() => {
							theme = t;
						}}
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
						<div class="w-32 truncate">{t}</div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="h-3 w-3 shrink-0 {theme === t ? 'visible' : 'invisible'}"
						>
							<path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
						</svg>
					</button>
				</li>
			{/each}
		</ul>
	</div>
</div>
