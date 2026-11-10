<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ArrowLeftIcon, HouseLineIcon } from 'phosphor-svelte';

	const notFound = $derived(page.status === 404);
	const title = $derived(notFound ? 'Page not found' : 'Something went wrong');
	const heading = $derived(notFound ? 'Lost?' : 'Oops!');
	const lede = $derived(
		notFound ? 'There’s no page at this address.' : 'Something broke on our end.'
	);
	const homeHref = $derived(
		page.data.user ? resolve('/(authenticated)/home') : resolve('/(public)')
	);
</script>

<svelte:head>
	<title>{title} · julian-one</title>
</svelte:head>

<div
	class="my-auto flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-center md:gap-12 lg:gap-24"
>
	<div
		class="flex w-full min-w-0 flex-col items-center gap-4 text-center md:w-85 md:items-start md:text-start lg:w-102"
	>
		<p class="text-sm tracking-wider text-secondary uppercase">Error {page.status}</p>
		<h1
			class="text-5xl leading-none font-bold tracking-tighter wrap-anywhere md:text-6xl lg:text-7xl"
		>
			{heading}
		</h1>
		<p
			class="mt-1 max-w-xl text-lg text-balance wrap-anywhere text-secondary md:text-xl lg:text-2xl"
		>
			{lede}
		</p>
		<div class="mt-4 grid w-full grid-cols-2 gap-3">
			<a
				class="btn border-primary bg-base-100 px-3 text-base whitespace-nowrap text-primary hover:bg-base-300 md:px-6"
				href={homeHref}
			>
				<HouseLineIcon class="size-5 shrink-0" aria-hidden="true" />
				Go home
			</a>
			<button
				class="btn border-base-content bg-base-100 px-3 text-base whitespace-nowrap hover:bg-base-300 md:px-6"
				type="button"
				onclick={() => {
					history.back();
				}}
			>
				<ArrowLeftIcon class="size-5 shrink-0" aria-hidden="true" />
				Go back
			</button>
		</div>
	</div>
	<p
		class="order-first flex h-64 w-52 shrink-0 items-center justify-center rounded-2xl bg-accent text-7xl leading-none font-bold tracking-tighter text-accent-content ring-2 ring-base-300 ring-offset-6 ring-offset-base-100 md:order-none md:h-75 md:w-60 md:rounded-4xl md:text-8xl lg:h-100 lg:w-80 lg:text-9xl"
		aria-hidden="true"
	>
		{page.status}
	</p>
</div>
