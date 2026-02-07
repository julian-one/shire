<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const duration = (iso: string): string => {
		const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
		if (seconds < 60) return `${seconds}s`;
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h`;
		return `${Math.floor(hours / 24)}d`;
	};

	const pressures = (node: { memory_pressure: boolean; disk_pressure: boolean; pid_pressure: boolean }): string[] => {
		const active: string[] = [];
		if (node.memory_pressure) active.push('memory');
		if (node.disk_pressure) active.push('disk');
		if (node.pid_pressure) active.push('pid');
		return active;
	};

	const daysUntil = (iso: string): number => Math.max(0, Math.floor((new Date(iso).getTime() - Date.now()) / 86400000));

	const gauge = (percent: number): string => {
		if (percent >= 90) return 'text-error';
		if (percent >= 70) return 'text-warning';
		return 'text-success';
	};

	const anyOk = $derived(
		[data.nodes, data.deployments, data.pods, data.warnings, data.certificates].some(
			(section) => section.state === 'ok'
		)
	);
</script>

{#snippet unavailable(label: string)}
	<div
		class="alert alert-warning alert-soft"
		role="alert"
	>
		<span>{label} is temporarily unavailable — try again shortly.</span>
	</div>
{/snippet}

<main class="w-full flex-1 p-4 md:p-6">
	<h1 class="mb-6 text-2xl font-bold">cluster</h1>

	{#if anyOk}
		<div class="stats stats-vertical lg:stats-horizontal border-base-300 bg-base-200 mb-8 w-full border">
			{#if data.nodes.state === 'ok'}
				{@const ready = data.nodes.items.filter((node) => node.ready).length}
				<div class="stat">
					<div class="stat-title">nodes</div>
					<div
						class="stat-value"
						class:text-error={ready < data.nodes.items.length}
					>
						{ready}/{data.nodes.items.length}
					</div>
					<div class="stat-desc">ready</div>
				</div>
			{/if}
			{#if data.deployments.state === 'ok'}
				{@const healthy = data.deployments.items.filter(
					(deployment) => deployment.ready_replicas === deployment.desired_replicas
				).length}
				<div class="stat">
					<div class="stat-title">deployments</div>
					<div
						class="stat-value"
						class:text-error={healthy < data.deployments.items.length}
					>
						{healthy}/{data.deployments.items.length}
					</div>
					<div class="stat-desc">healthy</div>
				</div>
			{/if}
			{#if data.pods.state === 'ok'}
				{@const healthy = data.pods.items.filter((pod) => pod.phase === 'Running' || pod.phase === 'Succeeded').length}
				<div class="stat">
					<div class="stat-title">pods</div>
					<div
						class="stat-value"
						class:text-error={healthy < data.pods.items.length}
					>
						{healthy}/{data.pods.items.length}
					</div>
					<div class="stat-desc">healthy</div>
				</div>
			{/if}
			{#if data.warnings.state === 'ok'}
				<div class="stat">
					<div class="stat-title">warnings</div>
					<div
						class="stat-value"
						class:text-warning={data.warnings.items.length > 0}
					>
						{data.warnings.items.length}
					</div>
					<div class="stat-desc">last hour</div>
				</div>
			{/if}
			{#if data.certificates.state === 'ok'}
				{@const ready = data.certificates.items.filter((certificate) => certificate.ready).length}
				<div class="stat">
					<div class="stat-title">certificates</div>
					<div
						class="stat-value"
						class:text-error={ready < data.certificates.items.length}
					>
						{ready}/{data.certificates.items.length}
					</div>
					<div class="stat-desc">ready</div>
				</div>
			{/if}
		</div>
	{/if}

	<section class="mb-8">
		<h2 class="mb-3 text-lg font-semibold">nodes</h2>
		{#if data.nodes.state === 'ok'}
			<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
				{#each data.nodes.items as node (node.name)}
					{@const active = pressures(node)}
					<div class="card card-border bg-base-200">
						<div class="card-body">
							<div class="flex items-center justify-between">
								<h3 class="card-title">{node.name}</h3>
								<div class="flex items-center gap-2 text-sm">
									<span
										class="status"
										class:status-success={node.ready}
										class:status-error={!node.ready}
										aria-hidden="true"
									></span>
									{node.ready ? 'ready' : 'not ready'}
								</div>
							</div>
							<p class="text-base-content/70 text-sm">{node.kubelet_version}</p>
							<div class="mt-2 flex justify-around gap-4">
								<div class="flex flex-col items-center gap-1">
									<div
										class="radial-progress {gauge(node.cpu_percent)}"
										style="--value:{node.cpu_percent}; --size:4.5rem; --thickness:0.4rem"
										aria-valuenow={node.cpu_percent}
										role="progressbar"
									>
										{node.cpu_percent}%
									</div>
									<span class="text-sm">cpu</span>
									<span class="text-base-content/70 text-xs">{node.cpu_usage} / {node.cpu_allocatable}</span>
								</div>
								<div class="flex flex-col items-center gap-1">
									<div
										class="radial-progress {gauge(node.memory_percent)}"
										style="--value:{node.memory_percent}; --size:4.5rem; --thickness:0.4rem"
										aria-valuenow={node.memory_percent}
										role="progressbar"
									>
										{node.memory_percent}%
									</div>
									<span class="text-sm">memory</span>
									<span class="text-base-content/70 text-xs">{node.memory_usage}</span>
								</div>
							</div>
							{#if active.length > 0}
								<div class="mt-2 flex flex-wrap gap-2">
									{#each active as pressure (pressure)}
										<span class="badge badge-soft badge-warning">{pressure} pressure</span>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			{@render unavailable('node data')}
		{/if}
	</section>

	<section class="mb-8">
		<h2 class="mb-3 text-lg font-semibold">certificates</h2>
		{#if data.certificates.state === 'ok'}
			<ul class="list bg-base-200 border-base-300 rounded-box border">
				{#each data.certificates.items as certificate (certificate.namespace + '/' + certificate.name)}
					<li class="list-row items-center">
						<span
							class="status"
							class:status-success={certificate.ready}
							class:status-error={!certificate.ready}
							aria-label={certificate.ready ? 'ready' : 'not ready'}
						></span>
						<div>
							<div>{certificate.name}</div>
							<div class="text-base-content/70 text-xs">{certificate.namespace}</div>
						</div>
						<span class="max-sm:list-col-wrap text-base-content/70 text-sm">
							expires in {daysUntil(certificate.not_after)}d · renews in {daysUntil(certificate.renewal_time)}d
						</span>
					</li>
				{/each}
			</ul>
		{:else}
			{@render unavailable('certificate data')}
		{/if}
	</section>

	<section class="mb-8">
		<h2 class="mb-3 text-lg font-semibold">warnings</h2>
		{#if data.warnings.state === 'ok'}
			{#if data.warnings.items.length === 0}
				<p class="text-base-content/50 text-sm">no warnings in the last hour</p>
			{:else}
				<ul class="list bg-base-200 border-base-300 rounded-box border">
					{#each data.warnings.items as warning ([warning.namespace, warning.name, warning.reason, warning.last_seen].join('/'))}
						<li class="list-row">
							<span
								class="status status-warning mt-1"
								aria-hidden="true"
							></span>
							<div>
								<div class="font-semibold">{warning.reason}</div>
								<div class="text-base-content/70 text-xs">
									{warning.kind.toLowerCase()}/{warning.name} · {warning.namespace}
								</div>
							</div>
							<p class="list-col-wrap text-sm">{warning.message}</p>
							<span class="text-base-content/70 text-sm">×{warning.count} · {duration(warning.last_seen)} ago</span>
						</li>
					{/each}
				</ul>
			{/if}
		{:else}
			{@render unavailable('warning data')}
		{/if}
	</section>

	<section class="mb-8">
		<h2 class="mb-3 text-lg font-semibold">deployments</h2>
		{#if data.deployments.state === 'ok'}
			<div class="border-base-300 rounded-box overflow-x-auto border">
				<table class="table-zebra table">
					<thead>
						<tr>
							<th>namespace</th>
							<th>name</th>
							<th>ready</th>
							<th>images</th>
						</tr>
					</thead>
					<tbody>
						{#each data.deployments.items as deployment (deployment.namespace + '/' + deployment.name)}
							<tr>
								<td class="text-base-content/70">{deployment.namespace}</td>
								<td>{deployment.name}</td>
								<td>
									<span
										class="badge badge-soft badge-sm"
										class:badge-success={deployment.ready_replicas === deployment.desired_replicas}
										class:badge-error={deployment.ready_replicas !== deployment.desired_replicas}
									>
										{deployment.ready_replicas}/{deployment.desired_replicas}
									</span>
								</td>
								<td class="text-base-content/70 text-sm">{deployment.images.join(', ')}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			{@render unavailable('deployment data')}
		{/if}
	</section>

	<section class="mb-8">
		<h2 class="mb-3 text-lg font-semibold">pods</h2>
		{#if data.pods.state === 'ok'}
			<div class="border-base-300 rounded-box overflow-x-auto border">
				<table class="table-zebra table-sm table">
					<thead>
						<tr>
							<th>namespace</th>
							<th>name</th>
							<th>phase</th>
							<th>restarts</th>
							<th>cpu</th>
							<th>memory</th>
							<th>node</th>
							<th>age</th>
						</tr>
					</thead>
					<tbody>
						{#each data.pods.items as pod (pod.namespace + '/' + pod.name)}
							<tr>
								<td class="text-base-content/70">{pod.namespace}</td>
								<td>{pod.name}</td>
								<td>
									<span
										class="badge badge-soft badge-sm"
										class:badge-success={pod.phase === 'Running' || pod.phase === 'Succeeded'}
										class:badge-error={pod.phase === 'Failed'}
										class:badge-warning={pod.phase === 'Pending'}
									>
										{pod.phase.toLowerCase()}
									</span>
								</td>
								<td>
									{#if pod.restarts > 0}
										<span class="badge badge-soft badge-error badge-sm">{pod.restarts}</span>
									{:else}
										<span class="text-base-content/70">0</span>
									{/if}
									{#if pod.last_termination}
										<span class="badge badge-outline badge-error badge-sm">
											{pod.last_termination.toLowerCase()}
										</span>
									{/if}
								</td>
								<td class="text-base-content/70">{pod.cpu_usage || '—'}</td>
								<td class="text-base-content/70">{pod.memory_usage || '—'}</td>
								<td class="text-base-content/70">{pod.node}</td>
								<td class="text-base-content/70">{duration(pod.created_at)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			{@render unavailable('pod data')}
		{/if}
	</section>
</main>
