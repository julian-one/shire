<script lang="ts">
	import { resolve } from '$app/paths';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { PageProps } from './$types';
	import Navbar from '#lib/components/Navbar.svelte';
	import LifeCanvas from '#lib/components/LifeCanvas.svelte';
	import portraitLight from '#lib/assets/portrait-light.jpg';
	import portraitDark from '#lib/assets/portrait-dark.jpg';
	import { HandWavingIcon, UserIcon } from 'phosphor-svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>julian-one</title>
</svelte:head>

<div class="relative isolate flex min-h-screen flex-col">
	{#if !prefersReducedMotion.current}
		<LifeCanvas />
	{/if}
	<a class="btn absolute start-4 -top-16 z-20 btn-neutral focus-visible:top-4" href="#content">
		Skip to content
	</a>
	<Navbar user={data.user} />
	<main
		id="content"
		class="mx-auto flex w-full max-w-xl grow flex-col gap-8 px-4 pt-8 pb-16 md:max-w-3xl md:flex-row md:items-center md:gap-10 md:px-8 lg:max-w-6xl lg:gap-16 lg:pt-14 lg:pb-24"
	>
		<div class="flex min-w-0 flex-col items-start gap-4 md:grow">
			<p class="text-sm tracking-wider text-secondary uppercase">Software engineer · Colorado</p>
			<h1
				class="text-5xl leading-none font-bold tracking-tighter wrap-anywhere md:text-6xl lg:text-7xl"
			>
				Hi, I’m Julian
			</h1>
			<p class="mt-1 max-w-xl text-xl text-balance wrap-anywhere text-secondary md:text-2xl">
				Curious by nature, <span class="whitespace-nowrap">builder by trade.</span>
			</p>
			<div class="mt-4 flex flex-wrap gap-3">
				<a class="btn btn-neutral btn-lg" href={resolve('/(public)/about')}>
					<UserIcon class="size-5 shrink-0" aria-hidden="true" />
					About me
				</a>
				<a class="btn btn-outline btn-lg" href={resolve('/(public)/about?tab=contact')}>
					<HandWavingIcon class="size-5 shrink-0" aria-hidden="true" />
					Say hello
				</a>
			</div>
		</div>
		<div
			class="order-first aspect-4/5 w-52 shrink-0 overflow-hidden rounded-2xl bg-accent ring-2 ring-base-300 ring-offset-6 ring-offset-base-100 md:order-none md:w-75 md:rounded-4xl lg:w-100"
		>
			<img class="size-full object-cover dark:hidden" src={portraitLight} alt="Julian, smiling" />
			<img
				class="hidden size-full object-cover dark:block"
				src={portraitDark}
				alt="Julian, smiling"
			/>
		</div>
	</main>
</div>
