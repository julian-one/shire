<script lang="ts">
	import { asset } from '$app/paths';
	import {
		ArrowsDownUpIcon,
		CaretRightIcon,
		CheckIcon,
		CodeIcon,
		GridFourIcon,
		PulseIcon,
		TreeStructureIcon
	} from 'phosphor-svelte';

	type SortId = 'az' | 'za' | 'newest' | 'oldest';

	type Sort = {
		id: SortId;
		label: string;
		summary: string;
	};

	type Project = {
		name: string;
		year: number;
		icon: typeof CodeIcon;
		tag?: string;
		builtWith: { name: string; logo: string; lift?: string }[];
		onGitHub?: boolean;
	};

	const sorts: Sort[] = [
		{ id: 'az', label: 'A to Z', summary: 'A to Z' },
		{ id: 'za', label: 'Z to A', summary: 'Z to A' },
		{ id: 'newest', label: 'Newest to oldest', summary: 'newest to oldest' },
		{ id: 'oldest', label: 'Oldest to newest', summary: 'oldest to newest' }
	];

	const projects: Project[] = [
		{
			name: 'Proton Therapy Planning',
			year: 2017,
			icon: PulseIcon,
			tag: 'Research',
			builtWith: [
				{ name: 'C', logo: asset('logos/c.svg') },
				{ name: 'C++', logo: asset('logos/cpp.svg'), lift: 'dark:brightness-175' }
			]
		},
		{
			name: 'Shire',
			year: 2025,
			icon: CodeIcon,
			tag: 'Web',
			builtWith: [
				{ name: 'Svelte', logo: asset('logos/svelte.svg') },
				{ name: 'Go', logo: asset('logos/go.svg') }
			],
			onGitHub: true
		},
		{
			name: 'Data Structures',
			year: 2026,
			icon: TreeStructureIcon,
			tag: 'Interactive',
			builtWith: []
		},
		{
			name: 'Game of Life',
			year: 2026,
			icon: GridFourIcon,
			tag: 'Interactive',
			builtWith: []
		}
	];

	let sort = $state<SortId>('newest');
	let menu: HTMLElement | undefined;

	const activeSort = $derived(
		sorts.find((option) => {
			return option.id === sort;
		})
	);
	const activeSummary = $derived(activeSort ? activeSort.summary : 'newest to oldest');

	const sortedProjects = $derived(
		[...projects].sort((a, b) => {
			const byName = a.name.localeCompare(b.name);
			if (sort === 'az') {
				return byName;
			}
			if (sort === 'za') {
				return -byName;
			}
			if (a.year === b.year) {
				return byName;
			}
			if (sort === 'oldest') {
				return a.year - b.year;
			}
			return b.year - a.year;
		})
	);
</script>

<div class="-mb-3 flex justify-end">
	<button
		class="btn btn-square size-11 btn-ghost"
		type="button"
		popovertarget="project-sort"
		aria-label="Sort projects, sorted {activeSummary}"
		style="anchor-name: --project-sort"
	>
		<ArrowsDownUpIcon class="size-5 text-secondary" aria-hidden="true" />
	</button>
	<div
		bind:this={menu}
		id="project-sort"
		class="dropdown dropdown-end mt-1.5 min-w-50 rounded-box border-2 border-base-300 bg-base-100 p-1.5"
		popover
		style="position-anchor: --project-sort"
	>
		<ul class="menu w-full p-0" aria-label="Sort projects">
			{#each sorts as option (option.id)}
				<li>
					<button
						class={['min-h-11 gap-3', sort === option.id ? 'font-bold' : 'font-normal']}
						type="button"
						aria-pressed={sort === option.id}
						onclick={() => {
							sort = option.id;
							menu?.hidePopover();
						}}
					>
						<span class="grow">{option.label}</span>
						{#if sort === option.id}
							<CheckIcon class="size-5 shrink-0" aria-hidden="true" />
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	</div>
</div>

<ul class="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
	{#each sortedProjects as project (project.name)}
		<li class="card border-base-300 card-border">
			<div class="card-body gap-2.5 p-5">
				<div class="flex items-center justify-between gap-3">
					<span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-base-300">
						<project.icon class="size-6" aria-hidden="true" />
					</span>
					<div class="flex items-center gap-3.5">
						{#if project.tag}
							<span class="text-sm tracking-wider text-secondary uppercase">{project.tag}</span>
						{/if}
						{#if project.builtWith.length > 0}
							<ul class="flex items-center gap-2.5" aria-label="Built with">
								{#each project.builtWith as technology (technology.name)}
									<li>
										<img
											class={['size-4.5 object-contain', technology.lift]}
											src={technology.logo}
											alt={technology.name}
											title={technology.name}
										/>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>
				<h2 class="card-title text-xl">{project.name}</h2>
				{#if project.onGitHub}
					<div class="card-actions">
						<a
							class="flex min-h-11 link items-center gap-2 font-bold link-hover underline-offset-6"
							href="https://github.com/julian-one/shire"
						>
							View on GitHub
							<CaretRightIcon class="size-5 shrink-0" aria-hidden="true" />
						</a>
					</div>
				{/if}
			</div>
		</li>
	{/each}
</ul>
