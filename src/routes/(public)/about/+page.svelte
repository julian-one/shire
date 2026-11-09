<script lang="ts">
	import type { PageProps } from './$types';
	import Navbar from '#lib/components/Navbar.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>About · julian-one</title>
</svelte:head>

<div class="relative flex min-h-screen flex-col">
	<a class="btn absolute start-4 -top-16 z-20 btn-neutral focus-visible:top-4" href="#content">
		Skip to content
	</a>
	<Navbar user={data.user} />
	<main
		id="content"
		class="mx-auto flex w-full max-w-xl grow flex-col gap-12 px-4 pt-8 pb-16 md:max-w-3xl md:px-8 lg:max-w-6xl lg:pt-14 lg:pb-24"
	>
		<h1
			class="text-5xl leading-none font-bold tracking-tighter wrap-anywhere md:text-6xl lg:text-7xl"
		>
			About
		</h1>
		<section id="contact" class="flex flex-col gap-4" aria-labelledby="contact-heading">
			<h2 id="contact-heading" class="text-sm tracking-wider text-secondary uppercase">Contact</h2>
		</section>
	</main>
</div>
