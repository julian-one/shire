<script lang="ts">
	import { CaretRightIcon, GithubLogoIcon, LinkedinLogoIcon } from 'phosphor-svelte';
</script>

<ul class="list max-w-2xl">
	<li>
		<a class="group list-row min-h-16 items-center" href="https://github.com/julian-one" rel="me">
			<GithubLogoIcon class="size-6 shrink-0 text-primary" aria-hidden="true" />
			<span class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
				<span class="text-lg font-bold underline-offset-6 group-hover:underline">GitHub</span>
				<span class="wrap-anywhere text-secondary">github.com/julian-one</span>
			</span>
			<CaretRightIcon
				class="size-5 shrink-0 text-secondary transition-transform group-hover:translate-x-1"
				aria-hidden="true"
			/>
		</a>
	</li>
	<li>
		<a
			class="group list-row min-h-16 items-center"
			href="https://www.linkedin.com/in/julian-one/"
			rel="me"
		>
			<LinkedinLogoIcon class="size-6 shrink-0 text-primary" aria-hidden="true" />
			<span class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
				<span class="text-lg font-bold underline-offset-6 group-hover:underline">LinkedIn</span>
				<span class="wrap-anywhere text-secondary">linkedin.com/in/julian-one</span>
			</span>
			<CaretRightIcon
				class="size-5 shrink-0 text-secondary transition-transform group-hover:translate-x-1"
				aria-hidden="true"
			/>
		</a>
	</li>
</ul>
