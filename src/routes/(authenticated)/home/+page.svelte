<script lang="ts">
	import moment from 'moment';
	import type { PageData } from './$types';
	import { AuthStore } from '$lib/stores/auth.svelte';
	import { toShortTimezone } from '$lib/helpers/timezone';

	let { data } = $props<{ data: PageData }>();

	let user = $derived(AuthStore.user);

	let currentTime = $state(moment().format('h:mm A'));
	let currentDate = $state(moment().format('MMM D, YYYY'));
	let timezoneAbbr = $derived(data.location?.timezone ? toShortTimezone(data.location.timezone) : '--');

	// Update time every minute
	$effect(() => {
		const interval = setInterval(() => {
			currentTime = moment().format('h:mm A');
			currentDate = moment().format('MMM D, YYYY');
		}, 60000);

		return () => clearInterval(interval);
	});
</script>

<div class="container mx-auto max-w-7xl px-4 py-8 md:py-12">
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-baseline gap-3">
			<div class="tooltip">
				<div class="tooltip-content">
					<div class="text-2xl">Welcome {user?.username}!</div>
				</div>
				<h1 class="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">¡Bienvenido {user?.username}!</h1>
			</div>
		</div>
	</div>

	<!-- Hero -->
	<div class="mb-8">
		<div
			class="hero rounded-box h-80 md:h-96 lg:h-128"
			style="background-image: url(/images/shire.png);"
		>
			<div class="hero-overlay rounded-box bg-opacity-60"></div>
			<div class="hero-content text-neutral-content h-full w-full items-end justify-start p-8 text-left md:p-12">
				<div class="max-w-3xl">
					<blockquote>
						<p class="text-lg leading-relaxed font-semibold md:text-xl lg:text-2xl">
							"If more of us valued food and cheer and song above hoarded gold, it would be a merrier world."
						</p>
						<footer class="mt-3 text-sm font-medium opacity-80"> — J.R.R. Tolkien </footer>
					</blockquote>
				</div>
			</div>
		</div>
	</div>

	<!-- Grid -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Time & Weather Card -->
		<div class="card bg-base-100 shadow-xl lg:col-span-2">
			<div class="card-body p-6 md:p-8">
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<!-- Time -->
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<div class="badge badge-primary badge-sm"></div>
							<span class="text-xs font-bold tracking-wide uppercase opacity-60">Local Time</span>
						</div>
						<div class="text-4xl font-black tabular-nums">{currentTime}</div>
						<div class="text-sm font-medium opacity-70">
							{currentDate}
						</div>
					</div>

					<!-- Weather -->
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<div class="badge badge-secondary badge-sm"></div>
							<span class="text-xs font-bold tracking-wide uppercase opacity-60">Weather</span>
						</div>
						{#if data.weather}
							<div class="flex items-center gap-3">
								<span class="text-5xl">{data.weather.icon}</span>
								<div>
									<div class="text-4xl font-black tabular-nums">{data.weather.temperature}°F</div>
									<div class="text-sm font-medium opacity-70">{data.weather.condition}</div>
								</div>
							</div>
						{:else}
							<div class="text-4xl font-black opacity-30">--</div>
							<div class="text-sm opacity-60">Unable to load</div>
						{/if}
					</div>
				</div>

				<div class="divider my-4"></div>

				<!-- Location Details -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<!-- Timezone -->
					<div class="space-y-1">
						<div class="text-xs font-bold tracking-wide uppercase opacity-50">Timezone</div>
						<div class="font-semibold">{timezoneAbbr}</div>
						<div class="text-sm opacity-70">{data.location?.timezone || 'Unknown'}</div>
					</div>

					<!-- Location -->
					<div class="space-y-1">
						<div class="text-xs font-bold tracking-wide uppercase opacity-50">Location</div>
						{#if data.location}
							<div class="font-semibold">
								{data.location.city}, {data.location.region}
							</div>
							<div class="text-sm opacity-70">{data.location.country}</div>
						{:else}
							<div class="opacity-30">--</div>
						{/if}
					</div>

					<!-- Coordinates -->
					{#if data.location}
						<div class="space-y-1">
							<div class="text-xs font-bold tracking-wide uppercase opacity-50">Coordinates</div>
							<div class="text-sm font-semibold">
								{data.location.latitude.toFixed(4)}°, {data.location.longitude.toFixed(4)}°
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Quick Actions Card -->
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body p-6 md:p-8">
				<h3 class="card-title mb-4 text-sm font-bold tracking-wider uppercase opacity-60"> Quick Actions </h3>

				<div class="space-y-3">
					<a
						href="/profile"
						class="btn btn-primary btn-block justify-start gap-3 shadow-lg"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
						<span class="font-bold">View Profile</span>
					</a>

					<button
						class="btn btn-outline btn-block justify-start gap-3 opacity-50"
						disabled
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
						<span class="font-bold">New Post</span>
					</button>
				</div>

				<div class="divider my-4"></div>

				<!-- Stats Overview -->
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium opacity-70">Posts</span>
						<span class="badge badge-lg font-bold">0</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium opacity-70">Activity</span>
						<span class="badge badge-success badge-lg font-bold">Active</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
