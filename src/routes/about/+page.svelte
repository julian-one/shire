<script lang="ts">
	import { resume } from '$lib/data/resume';
</script>

<svelte:head>
	<title>About | {resume.name}</title>
	<meta name="description" content="About {resume.name} - {resume.title}" />
</svelte:head>

<section class="py-12 sm:py-16 px-4">
	<div class="max-w-3xl mx-auto">
		<h1 class="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">About</h1>
		<p class="text-base sm:text-lg leading-relaxed">{resume.bio}</p>
	</div>
</section>
