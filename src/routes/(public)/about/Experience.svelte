<script lang="ts">
	import { asset } from '$app/paths';
	import { DesktopTowerIcon, DotsThreeVerticalIcon, GitBranchIcon } from 'phosphor-svelte';

	type Logo = {
		alt: string;
		light: string;
		dark?: string;
		height: string;
	};

	type Entry = {
		period: string;
		name: string;
		role: string;
		blurb: string;
		logos: Logo[];
		current?: boolean;
		detour?: boolean;
	};

	const entries: Entry[] = [
		{
			period: '2023 – Now',
			name: 'Westhill Global',
			role: 'Senior Software Engineer, Full Stack · Remote',
			blurb:
				'Startup building a fully digital managed-repair platform for insurance carriers, homeowners and contractors. I lead the development team, own the infrastructure from requirements through delivery, and run sprint planning and code review. Svelte, Go and GCP.',
			logos: [
				{
					alt: 'Westhill',
					light: asset('logos/westhill-light.svg'),
					dark: asset('logos/westhill-dark.svg'),
					height: 'h-6'
				}
			],
			current: true
		},
		{
			period: '2022 – 2023',
			name: 'Dish Network',
			role: 'Senior Software Engineer, Backend · Denver',
			blurb:
				'Sole senior backend engineer on the Retail Wireless Digital Interactions team, building services and infrastructure for Boost Mobile’s customer-facing apps in TypeScript on AWS, with CDK and test-driven development.',
			logos: [
				{
					alt: 'Dish Wireless',
					light: asset('logos/dish-light.svg'),
					dark: asset('logos/dish-dark.svg'),
					height: 'h-5'
				},
				{ alt: 'Boost Mobile', light: asset('logos/boost-mobile.svg'), height: 'h-8' }
			]
		},
		{
			period: '2020 – 2022',
			name: 'University of Colorado Denver',
			role: 'MS, Computer Science · Certificate in Software Engineering',
			blurb:
				'GPA 3.75. Coursework in software architecture, algorithms, operating systems, computer architecture, security and cryptography, deep learning, big data systems, mobile computing and graphics.',
			logos: [
				{
					alt: 'University of Colorado Denver',
					light: asset('logos/cu-denver-light.svg'),
					dark: asset('logos/cu-denver-dark.svg'),
					height: 'h-4'
				}
			]
		},
		{
			period: '2017 – 2020',
			name: 'UCLA David Geffen School of Medicine',
			role: 'Program Analyst II & III, Full Stack · Los Angeles',
			blurb:
				'Built web and mobile applications for medical research in HIPAA-regulated environments, on OpenACS, Tcl, PostgreSQL and Oracle, and helped move the group from on-premise servers to AWS.',
			logos: [
				{
					alt: 'UCLA David Geffen School of Medicine',
					light: asset('logos/ucla-light.svg'),
					dark: asset('logos/ucla-dark.svg'),
					height: 'h-5'
				}
			]
		},
		{
			period: '2013 – 2017',
			name: 'Pitzer College',
			role: 'BA, Biophysics · Claremont',
			blurb:
				'Biophysics through the Keck Science Department, with coursework across the Claremont Colleges: math at Pomona, computer science and engineering at Harvey Mudd. My two-semester senior thesis on multi-objective optimization for proton therapy grew out of the Mayo fellowship.',
			logos: [{ alt: 'Pitzer College', light: asset('logos/pitzer.svg'), height: 'h-8' }]
		},
		{
			period: 'Summer 2016',
			name: 'Mayo Clinic',
			role: 'Medical Physics Fellow · Phoenix',
			blurb:
				'Worked with Dr. Wei Liu on intensity-modulated proton therapy planning, extending a C++ optimizer from one weighted objective to a multi-objective search that produces a Pareto front of treatment plans. The project became my senior thesis.',
			logos: [],
			detour: true
		}
	];
</script>

<ul class="timeline timeline-vertical timeline-compact pt-2">
	{#each entries as entry (entry.name)}
		<li>
			<hr />
			<div
				class={[
					'timeline-middle row-start-1 self-start bg-base-100 py-1',
					entry.current ? 'text-primary' : 'text-secondary'
				]}
			>
				{#if entry.detour}
					<GitBranchIcon class="size-5" aria-hidden="true" />
				{:else}
					<DesktopTowerIcon class="size-5" aria-hidden="true" />
				{/if}
			</div>
			<div class="timeline-end ms-4 mb-8 flex flex-col self-start">
				<p
					class={[
						'mb-2 text-sm tabular-nums',
						entry.current ? 'font-bold text-primary' : 'text-secondary'
					]}
				>
					{entry.period}
				</p>
				{#if entry.logos.length > 0}
					<div class="mb-2 flex min-h-9 flex-wrap items-center gap-x-7 gap-y-3">
						{#each entry.logos as logo (logo.alt)}
							{#if logo.dark}
								<img
									class={['w-auto max-w-full dark:hidden', logo.height]}
									src={logo.light}
									alt={logo.alt}
								/>
								<img
									class={['hidden w-auto max-w-full dark:block', logo.height]}
									src={logo.dark}
									alt={logo.alt}
								/>
							{:else}
								<img class={['w-auto max-w-full', logo.height]} src={logo.light} alt={logo.alt} />
							{/if}
						{/each}
					</div>
				{/if}
				<h2 class="text-lg font-bold">{entry.name}</h2>
				<p class="text-lg text-secondary">{entry.role}</p>
				<p class="mt-2 max-w-2xl text-lg">{entry.blurb}</p>
			</div>
			<hr />
		</li>
	{/each}
	<li>
		<hr />
		<div class="timeline-middle row-start-1 self-start bg-base-100 py-1 text-secondary">
			<DotsThreeVerticalIcon class="size-5" aria-hidden="true" />
		</div>
		<div class="timeline-end ms-4 self-start text-sm text-secondary">The before time…</div>
	</li>
</ul>
