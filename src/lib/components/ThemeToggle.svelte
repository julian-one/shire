<script lang="ts">
	import { onMount } from 'svelte';
	import { MoonIcon, SunIcon } from 'phosphor-svelte';

	const lightTheme = 'everforest-light';
	const darkTheme = 'everforest-dark';

	let dark = $state(false);

	onMount(() => {
		dark = document.documentElement.dataset.theme === darkTheme;
	});

	function toggleTheme() {
		dark = !dark;
		const next = dark ? darkTheme : lightTheme;
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem('theme', next);
		} catch {
			return;
		}
	}
</script>

<button
	class="btn btn-circle size-11 shrink-0 btn-ghost"
	type="button"
	aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
	onclick={toggleTheme}
>
	{#if dark}
		<SunIcon class="size-5" aria-hidden="true" />
	{:else}
		<MoonIcon class="size-5" aria-hidden="true" />
	{/if}
</button>
