<script lang="ts">
	import { resolve } from '$app/paths';
	import LifeControls from './LifeControls.svelte';
	import portraitLight from '#lib/assets/portrait-light.jpg';
	import portraitDark from '#lib/assets/portrait-dark.jpg';
	import { HandWavingIcon, UserIcon } from 'phosphor-svelte';
	import { life } from '#lib/stores/life.svelte.js';
</script>

<svelte:head>
	<title>julian-one</title>
</svelte:head>

<canvas
	{@attach life.attach}
	class="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh w-full text-base-300"
	aria-hidden="true"
></canvas>
<LifeControls />
<div
	class="my-auto flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-center md:gap-12 lg:gap-24"
>
	<div
		class="flex w-full min-w-0 flex-col items-center gap-4 text-center md:w-85 md:items-start md:text-start lg:w-102"
	>
		<p class="text-sm tracking-wider text-secondary uppercase">Software engineer · Colorado</p>
		<h1
			class="text-5xl leading-none font-bold tracking-tighter wrap-anywhere md:text-6xl lg:text-7xl"
		>
			Hi, I’m Julian
		</h1>
		<p
			class="mt-1 max-w-xl text-lg text-balance wrap-anywhere text-secondary md:text-xl lg:text-2xl"
		>
			Curious by nature, <span class="whitespace-nowrap">builder by trade.</span>
		</p>
		<div class="mt-4 grid w-full grid-cols-2 gap-3">
			<a
				class="btn border-primary bg-base-100 px-3 text-base whitespace-nowrap text-primary hover:bg-base-300 md:px-6"
				href={resolve('/(public)/about')}
			>
				<UserIcon class="size-5 shrink-0" aria-hidden="true" />
				About me
			</a>
			<a
				class="btn border-base-content bg-base-100 px-3 text-base whitespace-nowrap hover:bg-base-300 md:px-6"
				href={resolve('/(public)/about?tab=contact')}
			>
				<HandWavingIcon class="size-5 shrink-0" aria-hidden="true" />
				Say hello
			</a>
		</div>
	</div>
	<div
		class="order-first h-64 w-52 shrink-0 overflow-hidden rounded-2xl bg-accent ring-2 ring-base-300 ring-offset-6 ring-offset-base-100 md:order-none md:h-75 md:w-60 md:rounded-4xl lg:h-100 lg:w-80"
	>
		<img class="size-full object-cover dark:hidden" src={portraitLight} alt="Julian, smiling" />
		<img
			class="hidden size-full object-cover dark:block"
			src={portraitDark}
			alt="Julian, smiling"
		/>
	</div>
</div>
