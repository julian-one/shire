<script lang="ts">
	import { resume } from '$lib/data/resume';
</script>

<svelte:head>
	<title>{resume.name} | {resume.title}</title>
	<meta name="description" content="{resume.name} - {resume.title}. {resume.tagline}" />
</svelte:head>

<div class="hero min-h-[60vh] sm:min-h-[70vh] bg-base-200 px-4">
	<div class="hero-content text-center">
		<div class="max-w-2xl">
			<h1 class="text-4xl sm:text-5xl font-bold">{resume.name}</h1>
			<p class="text-xl sm:text-2xl text-primary mt-2">{resume.title}</p>
			<p class="py-4 sm:py-6 text-base sm:text-lg opacity-80">{resume.tagline}</p>
			<div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
				<a href="/about" class="btn btn-primary">About Me</a>
				<a href="/contact" class="btn btn-outline">Get in Touch</a>
			</div>
		</div>
	</div>
</div>
