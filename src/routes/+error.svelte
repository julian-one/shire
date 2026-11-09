<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

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
				<svg aria-hidden="true" class="size-5" viewBox="0 0 256 256" fill="currentColor">
					<path
						d="M240,208H224V136l2.34,2.34A8,8,0,0,0,237.66,127L139.31,28.68a16,16,0,0,0-22.62,0L18.34,127a8,8,0,0,0,11.32,11.31L32,136v72H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM48,120l80-80,80,80v88H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48Zm96,88H112V160h32Z"
					/>
				</svg>
				Go home
			</a>
			<button
				class="btn btn-outline"
				type="button"
				onclick={() => {
					history.back();
				}}
			>
				<svg aria-hidden="true" class="size-5" viewBox="0 0 256 256" fill="currentColor">
					<path
						d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"
					/>
				</svg>
				Go back
			</button>
		</div>
	</div>
</main>
