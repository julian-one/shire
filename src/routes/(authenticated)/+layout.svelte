<script lang="ts">
	import type { LayoutProps } from './$types';
	import Navbar from '#lib/components/Navbar.svelte';

	let { data, children }: LayoutProps = $props();
</script>

<Navbar user={data.user} />
<main class="p-4">
	{@render children()}
</main>
