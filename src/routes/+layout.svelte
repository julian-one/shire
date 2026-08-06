<script lang="ts">
	import '../app.css';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';

	let { children } = $props();
</script>

<div class="fixed top-4 right-4">
	<ThemeSwitcher />
</div>
{@render children()}
