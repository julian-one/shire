<script lang="ts">
	import { routes } from '$lib/paths';
</script>

<main class="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-10 p-4 py-16 xl:max-w-3xl">
	<h1 class="text-lg md:text-xl">about this site</h1>

	<section class="text-base-content/70 space-y-4 text-sm md:text-base">
		<p>
			welcome the julian-one my personal site i host for on premises i.e. my home lol. the montra was i am a
			professional how hard can it be... quite hard quite hard indeed.
		</p>
	</section>

	<section class="text-base-content/70 space-y-4 text-sm md:text-base">
		<h2 class="text-base-content">why this theme</h2>
		<p>the mark is a lowercase j and a dot. read it three ways:</p>
		<ul class="list-disc space-y-1 pl-5">
			<li>a terminal cursor, waiting for input</li>
			<li>
				a braille dot — the typeface, atkinson hyperlegible mono, was built by the braille institute of america so no
				character can be mistaken for another, and its circular forms echo braille's six-dot cell
			</li>
			<li>the one in julian-one: one mark, one dot, one name</li>
		</ul>
		<p>
			the colours come from the mark — warm ink on paper rather than black on white, with the cursor green tuned to
			clear wcag aa contrast. and by pure coincidence, a mark for j. roberts is set in a typeface named for j. robert
			atkinson, the institute's founder.
		</p>
		<div class="flex flex-wrap items-center gap-6 pt-2">
			<div class="flex items-center gap-2">
				<span class="border-base-content/20 bg-base-100 size-4 rounded border"></span>
				<span>#2c2c2a</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="bg-base-content size-4 rounded"></span>
				<span>#f1efe8</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="bg-primary size-4 rounded"></span>
				<span>#97c459</span>
			</div>
		</div>
	</section>

	<div class="divider"></div>

	<p class="text-sm md:text-base">
		<a
			href={routes.aboutMe}
			class="link link-hover">about me →</a
		>
	</p>
</main>
