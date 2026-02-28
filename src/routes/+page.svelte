<script lang="ts">
	import moment from 'moment';
	import { toShortTimezone } from '$lib/helpers/timezone';

	let { data } = $props();

	let user = $derived(data.user);

	let currentTime = $state(moment().format('h:mm:ss A'));
	let currentDate = $state(moment().format('MMM D, YYYY'));

	// Update time every second
	$effect(() => {
		const interval = setInterval(() => {
			currentTime = moment().format('h:mm:ss A');
			currentDate = moment().format('MMM D, YYYY');
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="container mx-auto max-w-7xl px-4 py-8 md:py-12">
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-baseline gap-3">
			<div class="tooltip">
				<div class="tooltip-content">
					<div class="text-2xl">Welcome{user ? ` ${user.username}` : ''}!</div>
				</div>
				<h1 class="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl"
					>¡Bienvenido{user ? ` ${user.username}` : ''}!</h1
				>
			</div>
		</div>
	</div>

	<!-- Hero -->
	<div class="mb-8">
		<div
			class="hero rounded-box h-80 md:h-96 lg:h-128"
			style="background-image: url(/images/shire.webp);"
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

	<!-- Dashboard -->
	<div class="stats stats-vertical border-base-content/10 lg:stats-horizontal w-full border">
		<div class="stat">
			<div class="stat-title">Local Time</div>
			<div class="stat-value tabular-nums">{currentTime}</div>
			<div class="stat-desc">{currentDate}</div>
		</div>

		{#await data.location}
			<div class="stat">
				<div class="stat-title">Timezone</div>
				<div class="stat-value"><span class="skeleton inline-block h-8 w-14"></span></div>
				<div class="stat-desc"><span class="skeleton inline-block h-3 w-24"></span></div>
			</div>
		{:then location}
			<div class="stat">
				<div class="stat-title">Timezone</div>
				<div class="stat-value text-2xl">{location?.timezone ? toShortTimezone(location.timezone) : '--'}</div>
				<div class="stat-desc">{location?.timezone || 'Unknown'}</div>
			</div>
		{/await}

		<div class="stat">
			<div class="stat-title">Weather</div>
			{#await data.weather}
				<div class="stat-value"><span class="skeleton inline-block h-8 w-20"></span></div>
				<div class="stat-desc"><span class="skeleton inline-block h-3 w-16"></span></div>
			{:then weather}
				{#if weather}
					<div class="stat-figure text-4xl">{weather.icon}</div>
					<div class="stat-value tabular-nums">{weather.temperature}°F</div>
					<div class="stat-desc">{weather.condition}</div>
				{:else}
					<div class="stat-value opacity-30">--</div>
					<div class="stat-desc">Unable to load</div>
				{/if}
			{/await}
		</div>

		{#await data.location}
			<div class="stat">
				<div class="stat-title">Location</div>
				<div class="stat-value"><span class="skeleton inline-block h-8 w-28"></span></div>
				<div class="stat-desc"><span class="skeleton inline-block h-3 w-16"></span></div>
			</div>
		{:then location}
			<div class="stat">
				<div class="stat-title">Location</div>
				{#if location}
					<div class="stat-value text-2xl">{location.city}, {location.region}</div>
					<div class="stat-desc"
						>{location.country} · {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°</div
					>
				{:else}
					<div class="stat-value opacity-30">--</div>
				{/if}
			</div>
		{/await}
	</div>
</div>
