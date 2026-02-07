<script lang="ts">
	import { routes } from '$lib/paths';
</script>

<main class="hero flex-1">
	<div class="hero-content flex-col gap-10 text-center">
		<p class="text-base md:text-lg">greetings from the shire</p>

		<nav class="flex gap-6 text-sm md:text-base">
			<a
				href={routes.aboutSite}
				class="link link-hover">about this site</a
			>
			<a
				href={routes.aboutMe}
				class="link link-hover">about me</a
			>
		</nav>
	</div>
</main>
