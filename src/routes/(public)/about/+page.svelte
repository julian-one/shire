<script lang="ts">
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import Navbar from '#lib/components/Navbar.svelte';
	import Experience from './Experience.svelte';
	import Technologies from './Technologies.svelte';
	import Projects from './Projects.svelte';
	import Contact from './Contact.svelte';

	type TabId = 'experience' | 'technologies' | 'projects' | 'contact';

	let { data }: PageProps = $props();

	const tabs: { id: TabId; label: string }[] = [
		{ id: 'experience', label: 'Experience' },
		{ id: 'technologies', label: 'Technologies' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'contact', label: 'Contact' }
	];

	const requested = page.url.searchParams.get('tab') ?? undefined;
	const requestedTab = tabs.find((tab) => {
		return tab.id === requested;
	});

	let selected = $state<TabId>(requestedTab ? requestedTab.id : 'experience');

	const onTabKey = (event: KeyboardEvent) => {
		const index = tabs.findIndex((tab) => {
			return tab.id === selected;
		});
		let next: number;
		if (event.key === 'ArrowRight') {
			next = (index + 1) % tabs.length;
		} else if (event.key === 'ArrowLeft') {
			next = (index + tabs.length - 1) % tabs.length;
		} else if (event.key === 'Home') {
			next = 0;
		} else if (event.key === 'End') {
			next = tabs.length - 1;
		} else {
			return;
		}
		event.preventDefault();
		const nextTab = tabs[next];
		if (!nextTab) {
			return;
		}
		selected = nextTab.id;
		const button = document.getElementById(`tab-${nextTab.id}`);
		if (button) {
			button.focus();
		}
	};
</script>

<svelte:head>
	<title>About · julian-one</title>
</svelte:head>

<div class="relative flex min-h-screen flex-col">
	<a class="btn absolute start-4 -top-16 z-20 btn-neutral focus-visible:top-4" href="#content">
		Skip to content
	</a>
	<Navbar user={data.user} />
	<main
		id="content"
		class="mx-auto flex w-full max-w-xl grow flex-col gap-10 px-4 pt-8 pb-16 md:max-w-3xl md:px-8 lg:max-w-6xl lg:pt-10 lg:pb-24"
	>
		<div class="flex max-w-4xl flex-col gap-3">
			<p class="text-sm tracking-wider text-secondary uppercase">About</p>
			<h1 class="text-5xl leading-none font-bold tracking-tighter wrap-anywhere md:text-6xl">
				The long version.
			</h1>
			<p class="mt-1 max-w-2xl text-xl text-secondary md:text-2xl">
				Not counting AP CS. Anyone else still have nightmares about BlueJ?
				<br />
				My love for software began during a summer internship in medical physics.
			</p>
		</div>
		<div
			role="tablist"
			tabindex="-1"
			aria-label="About sections"
			class="tabs tabs-border max-w-4xl flex-nowrap overflow-x-auto border-b-2 border-base-300"
			onkeydown={onTabKey}
		>
			{#each tabs as tab (tab.id)}
				<button
					type="button"
					role="tab"
					id="tab-{tab.id}"
					class={[
						'tab shrink-0 text-base font-bold whitespace-nowrap',
						selected === tab.id ? 'tab-active' : 'text-secondary!'
					]}
					aria-selected={selected === tab.id}
					aria-controls="panel-{tab.id}"
					tabindex={selected === tab.id ? 0 : -1}
					onclick={() => {
						selected = tab.id;
					}}
				>
					{tab.label}
				</button>
			{/each}
		</div>
		<div
			id="panel-{selected}"
			role="tabpanel"
			aria-labelledby="tab-{selected}"
			class="flex max-w-4xl flex-col gap-6"
		>
			{#if selected === 'experience'}
				<Experience />
			{:else if selected === 'technologies'}
				<Technologies />
			{:else if selected === 'projects'}
				<Projects />
			{:else}
				<Contact />
			{/if}
		</div>
	</main>
</div>
