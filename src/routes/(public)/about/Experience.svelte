<script lang="ts">
	import { asset } from '$app/paths';
	import { DesktopTowerIcon, GraduationCapIcon } from 'phosphor-svelte';

	type Logo = {
		alt: string;
		light: string;
		dark?: string;
		classes: string;
	};

	type BlurbLink = {
		label: string;
		href: string;
		after: string;
	};

	type Entry = {
		period: string;
		name: string;
		role: string;
		blurb: string;
		blurbLink?: BlurbLink;
		icon: typeof DesktopTowerIcon;
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
				'Startup building a fully digital managed-repair platform for insurance carriers, homeowners and contractors. I lead the development team, own the infrastructure from requirements through delivery, and run sprint planning and code review.',
			icon: DesktopTowerIcon,
			logos: [
				{
					alt: 'Westhill',
					light: asset('logos/westhill-light.svg'),
					dark: asset('logos/westhill-dark.svg'),
					classes: 'h-6.5'
				}
			],
			current: true
		},
		{
			period: '2022 – 2023',
			name: 'Dish Network',
			role: 'Senior Software Engineer, Backend · Denver',
			blurb:
				'Sole senior backend engineer on the Retail Wireless Digital Interactions team, building services and infrastructure for Boost Mobile’s customer-facing apps, with infrastructure as code and test-driven development.',
			icon: DesktopTowerIcon,
			logos: [
				{
					alt: 'Dish Wireless',
					light: asset('logos/dish-light.svg'),
					dark: asset('logos/dish-dark.svg'),
					classes: 'h-5.25 self-start'
				},
				{ alt: 'Boost Mobile', light: asset('logos/boost-mobile.svg'), classes: 'h-8.5 self-start' }
			]
		},
		{
			period: '2020 – 2022',
			name: 'University of Colorado Denver',
			role: 'MS, Computer Science · Certificate in Software Engineering',
			blurb:
				'Coursework in software architecture, algorithms, operating systems, computer architecture, security and cryptography, deep learning, big data systems, mobile computing and graphics.',
			icon: GraduationCapIcon,
			logos: [
				{
					alt: 'University of Colorado Denver',
					light: asset('logos/cu-denver-light.svg'),
					dark: asset('logos/cu-denver-dark.svg'),
					classes: 'h-4.5'
				}
			]
		},
		{
			period: '2017 – 2020',
			name: 'UCLA David Geffen School of Medicine',
			role: 'Program Analyst II & III, Full Stack · Los Angeles',
			blurb:
				'Built web and mobile applications for medical research in HIPAA-regulated environments, and helped move the group from on-premise servers to the cloud.',
			icon: DesktopTowerIcon,
			logos: [
				{
					alt: 'UCLA David Geffen School of Medicine',
					light: asset('logos/ucla-light.svg'),
					dark: asset('logos/ucla-dark.svg'),
					classes: 'h-4.75'
				}
			]
		},
		{
			period: 'Summer 2016',
			name: 'Mayo Clinic',
			role: 'Medical Physics Fellow · Phoenix',
			blurb:
				'Worked with Dr. Wei Liu on intensity-modulated proton therapy planning, extending an optimizer from one weighted objective to a multi-objective search that produces a Pareto front of treatment plans. The project became my senior thesis.',
			icon: DesktopTowerIcon,
			logos: [
				{
					alt: 'Mayo Clinic',
					light: asset('logos/mayo-light.svg'),
					dark: asset('logos/mayo-dark.svg'),
					classes: 'h-14'
				}
			],
			detour: true
		},
		{
			period: '2013 – 2017',
			name: 'Pitzer College',
			role: 'BA, Biophysics · Claremont',
			blurb:
				'Biophysics through the Keck Science Department, with coursework across the Claremont Colleges: math at Pomona, computer science and engineering at Harvey Mudd. My two-semester senior thesis on multi-objective optimization for proton therapy grew out of the Mayo fellowship.',
			icon: GraduationCapIcon,
			logos: [{ alt: 'Pitzer College', light: asset('logos/pitzer.svg'), classes: 'h-8.5' }]
		},
		{
			period: 'Class of 2013',
			name: 'Texas Military Institute',
			role: 'High school · San Antonio',
			blurb:
				'AP Physics and AP Computer Science gave me an early start in the two subjects that later shaped my degree and my career. Also a ',
			blurbLink: {
				label: 'first-team all-district linebacker',
				href: 'https://tminewsroom.com/2012/11/27/panthers-garner-district-football-honors/',
				after: ' in 2012.'
			},
			icon: GraduationCapIcon,
			logos: [
				{
					alt: 'Texas Military Institute crest',
					light: asset('logos/tmi-light.svg'),
					dark: asset('logos/tmi-dark.svg'),
					classes: 'h-16'
				}
			]
		}
	];

	const lastIndex = entries.length - 1;
</script>

<ul class="timeline timeline-vertical timeline-compact max-w-220 pt-2">
	{#each entries as entry, index (entry.name)}
		<li class={entry.detour ? 'relative block' : undefined}>
			{#if entry.detour}
				<span class="absolute top-0 bottom-0 left-2 w-1 bg-base-300" aria-hidden="true"></span>
				<img
					class="absolute top-0 left-0 h-7 w-15 dark:hidden"
					src={asset('timeline/fork-light.svg')}
					alt=""
					aria-hidden="true"
				/>
				<img
					class="absolute top-0 left-0 hidden h-7 w-15 dark:block"
					src={asset('timeline/fork-dark.svg')}
					alt=""
					aria-hidden="true"
				/>
				<span class="absolute top-7 bottom-7 left-12 w-1 bg-base-300" aria-hidden="true"></span>
				<span class="absolute top-14 left-10 bg-base-100 py-2 text-secondary">
					<entry.icon class="size-5" aria-hidden="true" />
				</span>
				<img
					class="absolute bottom-0 left-0 h-7 w-15 dark:hidden"
					src={asset('timeline/merge-light.svg')}
					alt=""
					aria-hidden="true"
				/>
				<img
					class="absolute bottom-0 left-0 hidden h-7 w-15 dark:block"
					src={asset('timeline/merge-dark.svg')}
					alt=""
					aria-hidden="true"
				/>
			{:else}
				{#if index > 0}
					<hr />
				{/if}
				<div
					class={[
						'timeline-middle row-start-1 self-start bg-base-100 py-1',
						entry.current ? 'text-base-content' : 'text-secondary'
					]}
				>
					<entry.icon class="size-5" aria-hidden="true" />
				</div>
			{/if}
			<div
				class={[
					'flex flex-col',
					entry.detour ? 'w-full ps-19 pt-9 pb-16' : 'timeline-end ms-4 mb-8 self-start'
				]}
			>
				<p
					class={[
						'mb-2 text-sm tabular-nums',
						entry.current ? 'font-bold text-base-content' : 'text-secondary'
					]}
				>
					{entry.period}
				</p>
				{#if entry.logos.length > 0}
					<div class="mb-2 flex min-h-9 flex-wrap items-center gap-x-7 gap-y-3">
						{#each entry.logos as logo (logo.alt)}
							{#if logo.dark}
								<img
									class={['w-auto max-w-full dark:hidden', logo.classes]}
									src={logo.light}
									alt={logo.alt}
								/>
								<img
									class={['hidden w-auto max-w-full dark:block', logo.classes]}
									src={logo.dark}
									alt={logo.alt}
								/>
							{:else}
								<img class={['w-auto max-w-full', logo.classes]} src={logo.light} alt={logo.alt} />
							{/if}
						{/each}
					</div>
				{/if}
				<h2 class="text-lg font-bold">{entry.name}</h2>
				<p class="text-lg text-secondary">{entry.role}</p>
				<p class="mt-2 max-w-155 text-lg">
					{entry.blurb}{#if entry.blurbLink}<a
							class="link"
							href={entry.blurbLink.href}
							target="_blank"
							rel="external noopener">{entry.blurbLink.label}</a
						>{entry.blurbLink.after}{/if}
				</p>
			</div>
			{#if !entry.detour && index < lastIndex}
				<hr />
			{/if}
		</li>
	{/each}
</ul>
