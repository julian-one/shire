<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<Navbar loggedIn={data.loggedIn} />

{#if data.degraded}
	<div
		class="alert alert-warning rounded-none"
		role="alert"
	>
		<span>Sign-in is temporarily unavailable. Your session is safe — try again shortly.</span>
	</div>
{/if}

{@render children()}
