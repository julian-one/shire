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
				'Startup building a digital managed-repair platform for insurers, homeowners and contractors. I lead the team behind its internal and external products, own the platform from requirements through delivery, and have rearchitected core systems to scale better and cost less.',
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
				'Sole senior backend engineer on the Retail Wireless Digital Interactions team, building the services and infrastructure behind Boost Mobile’s customer apps. I inherited serverless microservices that struggled with cold starts and moved them onto containers, making them faster and more reliable.',
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
				'Graduate program in computer science with a certificate in software engineering, spanning software architecture, algorithms and operating systems through security, deep learning and big data. I finished with a thesis in computer graphics on photorealistic rendering, bringing models built in Blender into an OpenGL pipeline.',
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
				'Built web apps for medical research in HIPAA-regulated environments alongside system administrators, developers and student workers, and helped move the group from on-premise servers to the cloud.',
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
				'Summer fellowship in medical physics with Dr. Wei Liu, working on intensity-modulated proton therapy planning. I extended a treatment-plan optimizer from a single weighted objective to a multi-objective search that maps out a Pareto front of plans.',
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
				'Biophysics through the Keck Science Department, with coursework across the Claremont Colleges: math at Pomona, computer science and engineering at Harvey Mudd. I spent two semesters turning the Mayo research into my senior thesis.',
			icon: GraduationCapIcon,
			logos: [{ alt: 'Pitzer College', light: asset('logos/pitzer.svg'), classes: 'h-8.5' }]
		},
		{
			period: 'Class of 2013',
			name: 'Texas Military Institute',
			role: 'High school · San Antonio',
			blurb:
				'College-prep school where AP Physics and AP Computer Science gave me an early start in the two subjects that later shaped my degree and career. I was also a ',
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
				{#if index < lastIndex}
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
							rel="external noopener"
						>
							{entry.blurbLink.label}
						</a>{entry.blurbLink.after}{/if}
				</p>
			</div>
			{#if !entry.detour && index < lastIndex}
				<hr />
			{/if}
		</li>
	{/each}
</ul>
