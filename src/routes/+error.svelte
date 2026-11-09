<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ArrowLeftIcon, HouseLineIcon } from 'phosphor-svelte';

	const title = $derived(page.status === 404 ? 'Page not found' : 'Something went wrong');
</script>

<svelte:head>
	<title>{page.status} · julian-one</title>
</svelte:head>

<main
	class="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-4 py-8 md:px-8 md:py-14"
>
	<p class="text-9xl leading-none font-bold tracking-tighter" aria-hidden="true">{page.status}</p>
	<div
		class="flex flex-col gap-5 border-t-2 border-base-300 pt-7 md:flex-row md:items-center md:justify-between"
	>
		<h1 class="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
		<div class="flex flex-wrap items-center gap-3">
			<a class="btn btn-neutral" href={resolve('/(public)')}>
				<HouseLineIcon class="size-5" aria-hidden="true" />
				Go home
			</a>
			<button
				class="btn btn-outline"
				type="button"
				onclick={() => {
					history.back();
				}}
			>
				<ArrowLeftIcon class="size-5" aria-hidden="true" />
				Go back
			</button>
		</div>
	</div>
</main>
