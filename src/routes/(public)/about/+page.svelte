<script lang="ts">
	import { page } from '$app/state';
	import { SmileyIcon } from 'phosphor-svelte';
	import Experience from './Experience.svelte';
	import Technologies from './Technologies.svelte';
	import Projects from './Projects.svelte';
	import Contact from './Contact.svelte';

	type TabId = 'experience' | 'technologies' | 'projects' | 'contact';

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

<div class="flex flex-col gap-10">
	<div class="flex max-w-220 flex-col gap-3">
		<p class="text-sm tracking-wider text-secondary uppercase">About</p>
		<h1 class="text-5xl leading-none font-bold tracking-tighter wrap-anywhere md:text-6xl">
			A
			<button
				type="button"
				class="tooltip tooltip-bottom cursor-help rounded-sm italic after:bg-secondary"
			>
				bit
				<span
					class="tooltip-content border-2 border-secondary bg-base-100 px-1.5 py-0.5 text-sm font-normal tracking-normal text-secondary not-italic"
					aria-hidden="true"
				>
					<span class="flex items-center gap-1.5">
						Pun intended
						<SmileyIcon class="size-4.5 shrink-0" aria-hidden="true" />
					</span>
				</span>
			</button>
			about me.
		</h1>
	</div>
	<div
		role="tablist"
		tabindex="-1"
		aria-label="About sections"
		class="tabs tabs-border -me-8 flex-nowrap overflow-x-auto border-b-2 border-base-300 pe-8 md:me-0 md:flex-wrap md:overflow-visible md:pe-0"
		onkeydown={onTabKey}
	>
		{#each tabs as tab (tab.id)}
			<button
				type="button"
				role="tab"
				id="tab-{tab.id}"
				class={[
					'tab shrink-0 text-base font-bold whitespace-nowrap',
					selected === tab.id
						? 'tab-active before:border-base-content before:bg-base-content'
						: 'text-secondary! underline-offset-6 hover:underline'
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
		class="flex flex-col gap-6"
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
</div>
