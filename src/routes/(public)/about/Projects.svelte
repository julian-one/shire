<script lang="ts">
	import { asset } from '$app/paths';
	import {
		CaretRightIcon,
		CodeIcon,
		GridFourIcon,
		PulseIcon,
		TreeStructureIcon
	} from 'phosphor-svelte';

	type Project = {
		name: string;
		description: string;
		icon: typeof CodeIcon;
		tag?: string;
		builtWith: { name: string; logo: string }[];
		onGitHub?: boolean;
	};

	const projects: Project[] = [
		{
			name: 'Proton Therapy Planning',
			description:
				'My 2017 senior thesis, rebuilt in 2026 from the recovered code and data: the constraint bug diagnosed, the plan it actually produced, and a corrected multi-objective experiment.',
			icon: PulseIcon,
			tag: 'Research',
			builtWith: [
				{ name: 'C++', logo: asset('logos/cpp.svg') },
				{ name: 'Python', logo: asset('logos/python.svg') }
			]
		},
		{
			name: 'Shire',
			description:
				'The code behind julian-one: a Svelte front end on a Go service, deployed to Google Cloud.',
			icon: CodeIcon,
			builtWith: [
				{ name: 'Svelte', logo: asset('logos/svelte.svg') },
				{ name: 'Go', logo: asset('logos/go.svg') },
				{ name: 'Google Cloud', logo: asset('logos/gcp.svg') }
			],
			onGitHub: true
		},
		{
			name: 'Data Structures Explorer',
			description:
				'Step-by-step visualizations of trees, heaps, graphs and hash tables — watch each one react as you insert, search and remove.',
			icon: TreeStructureIcon,
			tag: 'Interactive',
			builtWith: []
		},
		{
			name: 'Game of Life',
			description:
				'Conway’s cellular automaton in the browser: draw a starting pattern, then play, pause or step through generations.',
			icon: GridFourIcon,
			tag: 'Interactive',
			builtWith: []
		}
	];
</script>

<ul class="grid grid-cols-1 gap-3 md:grid-cols-2">
	{#each projects as project (project.name)}
		<li class="card border-base-300 card-border">
			<div class="card-body gap-2.5 p-5">
				<div class="flex items-center justify-between gap-3">
					<span
						class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary"
					>
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
											class="size-5 object-contain"
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
				<h2 class="card-title">{project.name}</h2>
				<p class="text-lg text-secondary">{project.description}</p>
				{#if project.onGitHub}
					<div class="card-actions">
						<a
							class="flex min-h-11 link items-center gap-2 font-bold link-primary link-hover underline-offset-6"
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
