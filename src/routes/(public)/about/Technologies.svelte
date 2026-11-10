<script lang="ts">
	import { asset } from '$app/paths';
	import {
		CaretRightIcon,
		CheckIcon,
		CloudIcon,
		DotsThreeIcon,
		FunnelSimpleIcon,
		SelectionAllIcon,
		SelectionBackgroundIcon,
		SelectionForegroundIcon
	} from 'phosphor-svelte';

	type Service = {
		name: string;
		years: string;
		logo: string;
	};

	type Technology = {
		name: string;
		years: string;
		logo: string;
		logoDark?: string;
		lift?: string;
		wide?: boolean;
		services?: Service[];
	};

	type Group = {
		id: string;
		label: string;
		icon: typeof CloudIcon;
		items: Technology[];
	};

	const groups: Group[] = [
		{
			id: 'frontend',
			label: 'Frontend',
			icon: SelectionForegroundIcon,
			items: [
				{
					name: 'TypeScript',
					years: '5 yrs',
					logo: asset('logos/typescript.svg'),
					lift: 'dark:brightness-125'
				},
				{ name: 'JavaScript', years: '7 yrs', logo: asset('logos/javascript.svg') },
				{ name: 'Svelte', years: '3 yrs', logo: asset('logos/svelte.svg') },
				{ name: 'Tailwind CSS', years: '3 yrs', logo: asset('logos/tailwind.svg') },
				{ name: 'daisyUI', years: '2 yrs', logo: asset('logos/daisyui.svg') },
				{
					name: 'jQuery',
					years: '3 yrs',
					logo: asset('logos/jquery.svg'),
					lift: 'dark:brightness-150'
				},
				{
					name: 'Bootstrap',
					years: '3 yrs',
					logo: asset('logos/bootstrap.svg'),
					lift: 'dark:brightness-150'
				},
				{
					name: 'CSS',
					years: '6 yrs',
					logo: asset('logos/css.svg'),
					lift: 'dark:brightness-175'
				}
			]
		},
		{
			id: 'backend',
			label: 'Backend',
			icon: SelectionBackgroundIcon,
			items: [
				{ name: 'Go', years: '3 yrs', logo: asset('logos/go.svg'), wide: true },
				{
					name: 'Python',
					years: '4 yrs',
					logo: asset('logos/python.svg'),
					lift: 'dark:brightness-125'
				},
				{
					name: 'Tcl',
					years: '3 yrs',
					logo: asset('logos/tcl.svg'),
					lift: 'dark:brightness-150'
				},
				{
					name: 'PostgreSQL',
					years: '7 yrs',
					logo: asset('logos/postgresql.svg'),
					lift: 'dark:brightness-125'
				},
				{
					name: 'Oracle',
					years: '3 yrs',
					logo: asset('logos/oracle.svg'),
					lift: 'dark:brightness-125',
					wide: true
				},
				{ name: 'Docker', years: '7 yrs', logo: asset('logos/docker.svg') }
			]
		},
		{
			id: 'cloud',
			label: 'Cloud',
			icon: CloudIcon,
			items: [
				{
					name: 'AWS',
					years: '5 yrs',
					logo: asset('logos/aws-light.svg'),
					logoDark: asset('logos/aws-dark.svg'),
					wide: true,
					services: [
						{ name: 'EC2', years: '5 yrs', logo: asset('logos/aws-ec2.svg') },
						{ name: 'Lambda', years: '5 yrs', logo: asset('logos/aws-lambda.svg') },
						{ name: 'CloudWatch', years: '5 yrs', logo: asset('logos/aws-cloudwatch.svg') },
						{ name: 'S3', years: '3 yrs', logo: asset('logos/aws-s3.svg') },
						{ name: 'CDK', years: '2 yrs', logo: asset('logos/aws-cdk.svg') },
						{ name: 'EKS', years: '2 yrs', logo: asset('logos/aws-eks.svg') },
						{ name: 'Fargate', years: '2 yrs', logo: asset('logos/aws-fargate.svg') },
						{ name: 'API Gateway', years: '2 yrs', logo: asset('logos/aws-api-gateway.svg') },
						{ name: 'SQS', years: '2 yrs', logo: asset('logos/aws-sqs.svg') },
						{ name: 'RDS', years: '2 yrs', logo: asset('logos/aws-rds.svg') },
						{ name: 'DynamoDB', years: '2 yrs', logo: asset('logos/aws-dynamodb.svg') },
						{ name: 'IAM', years: '2 yrs', logo: asset('logos/aws-iam.svg') }
					]
				},
				{
					name: 'GCP',
					years: '3 yrs',
					logo: asset('logos/gcp.svg'),
					services: [
						{ name: 'Cloud Run', years: '3 yrs', logo: asset('logos/gcp-cloud-run.svg') },
						{ name: 'Cloud Build', years: '3 yrs', logo: asset('logos/gcp-cloud-build.svg') },
						{ name: 'Spanner', years: '3 yrs', logo: asset('logos/gcp-spanner.svg') },
						{ name: 'AlloyDB', years: '3 yrs', logo: asset('logos/gcp-alloydb.svg') },
						{ name: 'Cloud Logging', years: '3 yrs', logo: asset('logos/gcp-cloud-logging.svg') },
						{ name: 'IAM', years: '3 yrs', logo: asset('logos/gcp-iam.svg') }
					]
				}
			]
		},
		{
			id: 'other',
			label: 'Other',
			icon: DotsThreeIcon,
			items: [
				{ name: 'C', years: '2 yrs', logo: asset('logos/c.svg') },
				{
					name: 'C++',
					years: '2 yrs',
					logo: asset('logos/cpp.svg'),
					lift: 'dark:brightness-175'
				},
				{
					name: 'Java',
					years: '1 yr',
					logo: asset('logos/java.svg'),
					lift: 'dark:brightness-125'
				},
				{
					name: 'Racket',
					years: '1 yr',
					logo: asset('logos/racket.svg'),
					lift: 'dark:brightness-175'
				},
				{ name: 'TensorFlow', years: '2 yrs', logo: asset('logos/tensorflow.svg') },
				{ name: 'Hadoop', years: '2 yrs', logo: asset('logos/hadoop.svg'), wide: true },
				{
					name: 'Spark',
					years: '2 yrs',
					logo: asset('logos/spark-light.svg'),
					logoDark: asset('logos/spark-dark.svg'),
					wide: true
				},
				{
					name: 'OpenGL',
					years: '2 yrs',
					logo: asset('logos/opengl.svg'),
					lift: 'dark:brightness-125',
					wide: true
				}
			]
		}
	];

	const filters = [{ id: 'all', label: 'All', icon: SelectionAllIcon }, ...groups];

	let filter = $state('all');
	let expanded = $state<string>();
	let menu: HTMLElement | undefined;

	const activeFilter = $derived(
		filters.find((option) => {
			return option.id === filter;
		})
	);
	const activeLabel = $derived(activeFilter ? activeFilter.label : 'All');

	const visibleGroups = $derived(
		groups.filter((group) => {
			if (filter === 'all') {
				return true;
			}
			return group.id === filter;
		})
	);
</script>

<div class="-mb-14 flex justify-end">
	<button
		class="btn relative btn-square size-11 btn-ghost"
		type="button"
		popovertarget="technology-filter"
		aria-label="Filter technologies, showing {activeLabel}"
		style="anchor-name: --technology-filter"
	>
		<FunnelSimpleIcon
			class={['size-5', filter === 'all' ? 'text-secondary' : 'text-base-content']}
			aria-hidden="true"
		/>
		{#if filter !== 'all'}
			<span class="absolute top-2 right-2 status bg-base-content" aria-hidden="true"></span>
		{/if}
	</button>
	<div
		bind:this={menu}
		id="technology-filter"
		class="dropdown dropdown-end mt-1.5 min-w-50 rounded-box border-2 border-base-300 bg-base-100 p-1.5"
		popover
		style="position-anchor: --technology-filter"
	>
		<ul class="menu w-full p-0" aria-label="Filter technologies">
			{#each filters as option (option.id)}
				<li>
					<button
						class={['min-h-11 gap-3', filter === option.id ? 'font-bold' : 'font-normal']}
						type="button"
						aria-pressed={filter === option.id}
						onclick={() => {
							filter = option.id;
							menu?.hidePopover();
						}}
					>
						<option.icon
							class={[
								'size-5 shrink-0',
								filter === option.id ? 'text-base-content' : 'text-secondary'
							]}
							aria-hidden="true"
						/>
						<span class="grow">{option.label}</span>
						{#if filter === option.id}
							<CheckIcon class="size-5 shrink-0" aria-hidden="true" />
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	</div>
</div>

{#each visibleGroups as group (group.id)}
	<div class="flex flex-col gap-3">
		<h2 class="text-sm tracking-wider text-secondary uppercase">{group.label}</h2>
		<ul class="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4">
			{#each group.items as item (item.name)}
				<li>
					{#if item.services}
						<button
							type="button"
							class={[
								'card w-full cursor-pointer text-start card-border hover:border-secondary',
								expanded === item.name
									? 'border-base-content bg-base-content/10'
									: 'border-base-300'
							]}
							aria-expanded={expanded === item.name}
							aria-controls="services-{item.name}"
							onclick={() => {
								if (expanded === item.name) {
									expanded = undefined;
								} else {
									expanded = item.name;
								}
							}}
						>
							<span class="card-body min-h-16 flex-row items-center gap-2.5 p-2.5 md:gap-3 md:p-3">
								<span class="flex size-8 shrink-0 items-center justify-center md:size-10">
									{#if item.logoDark}
										<img
											class={[
												'object-contain dark:hidden',
												item.wide ? 'h-6 w-8 md:h-7 md:w-10' : 'size-8'
											]}
											src={item.logo}
											alt=""
										/>
										<img
											class={[
												'hidden object-contain dark:block',
												item.wide ? 'h-6 w-8 md:h-7 md:w-10' : 'size-8'
											]}
											src={item.logoDark}
											alt=""
										/>
									{:else}
										<img
											class={[
												'object-contain',
												item.lift,
												item.wide ? 'h-6 w-8 md:h-7 md:w-10' : 'size-8'
											]}
											src={item.logo}
											alt=""
										/>
									{/if}
								</span>
								<span class="flex min-w-0 grow flex-col">
									<span class="text-base font-bold wrap-anywhere">{item.name}</span>
									<span class="text-sm font-bold text-secondary tabular-nums">{item.years}</span>
								</span>
								<CaretRightIcon
									class={[
										'size-5 shrink-0 text-secondary transition-transform',
										expanded === item.name ? 'rotate-90' : ''
									]}
									aria-hidden="true"
								/>
							</span>
						</button>
					{:else}
						<div class="card h-full border-base-300 card-border">
							<div class="card-body min-h-16 flex-row items-center gap-2.5 p-2.5 md:gap-3 md:p-3">
								<span class="flex size-8 shrink-0 items-center justify-center md:size-10">
									{#if item.logoDark}
										<img
											class={[
												'object-contain dark:hidden',
												item.wide ? 'h-6 w-8 md:h-7 md:w-10' : 'size-8'
											]}
											src={item.logo}
											alt=""
										/>
										<img
											class={[
												'hidden object-contain dark:block',
												item.wide ? 'h-6 w-8 md:h-7 md:w-10' : 'size-8'
											]}
											src={item.logoDark}
											alt=""
										/>
									{:else}
										<img
											class={[
												'object-contain',
												item.lift,
												item.wide ? 'h-6 w-8 md:h-7 md:w-10' : 'size-8'
											]}
											src={item.logo}
											alt=""
										/>
									{/if}
								</span>
								<span class="flex min-w-0 flex-col">
									<span class="text-base font-bold wrap-anywhere">{item.name}</span>
									<span class="text-sm font-bold text-secondary tabular-nums">{item.years}</span>
								</span>
							</div>
						</div>
					{/if}
				</li>
			{/each}
		</ul>
		{#each group.items as item (item.name)}
			{#if item.services && expanded === item.name}
				<div id="services-{item.name}" class="card border-base-300 card-border">
					<div class="card-body gap-2 p-4">
						<h3 class="text-sm tracking-wider text-secondary uppercase">{item.name} services</h3>
						<ul class="grid grid-cols-1 gap-x-4 gap-y-1 md:grid-cols-3 lg:grid-cols-4">
							{#each item.services as service (service.name)}
								<li class="flex items-center gap-2.5 py-1.5">
									<img
										class="size-6 shrink-0 rounded-sm object-contain"
										src={service.logo}
										alt=""
									/>
									<span class="min-w-0 wrap-anywhere">{service.name}</span>
									<span class="ms-auto shrink-0 text-sm font-bold text-secondary tabular-nums">
										{service.years}
									</span>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}
		{/each}
	</div>
{/each}
