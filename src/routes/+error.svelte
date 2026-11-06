<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>{page.status} · Shire</title>
</svelte:head>

<main class="flex min-h-screen items-center justify-center p-4">
	<div class="text-center">
		<h1 class="text-4xl font-bold">{page.status}</h1>
		<p class="mt-2">{page.error?.message}</p>
		<a class="btn mt-4 btn-primary" href={resolve('/(authenticated)')}>Go home</a>
	</div>
</main>
