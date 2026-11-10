<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import faviconDark from '#lib/assets/favicon-dark.svg';
	import type { LayoutProps } from './$types';
	import Navbar from '#lib/components/Navbar.svelte';
	import Toasts from '#lib/components/Toasts.svelte';

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} media="(prefers-color-scheme: light)" />
	<link rel="icon" href={faviconDark} media="(prefers-color-scheme: dark)" />
</svelte:head>

<div class="relative isolate flex min-h-screen flex-col">
	<a class="btn absolute start-4 -top-16 z-20 btn-neutral focus-visible:top-4" href="#content">
		Skip to content
	</a>
	<Navbar user={data.user} />
	<main
		id="content"
		class="mx-auto flex w-full max-w-400 grow flex-col px-8 pt-8 pb-16 lg:pt-10 lg:pb-24"
	>
		{@render children()}
	</main>
</div>

<Toasts />
