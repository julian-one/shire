<script lang="ts">
	import moment from 'moment';

	function to_short_timezone(timezone: string): string {
		return (
			new Intl.DateTimeFormat('en-US', {
				timeZone: timezone,
				timeZoneName: 'short'
			})
				.formatToParts(new Date())
				.find((part) => part.type === 'timeZoneName')?.value || ''
		);
	}

	let { data } = $props();

	let user = $derived(data.user);

	let current_time = $state(moment().format('h:mm:ss A'));
	let current_date = $state(moment().format('MMM D, YYYY'));

	// Update time every second
	$effect(() => {
		const interval = setInterval(() => {
			current_time = moment().format('h:mm:ss A');
			current_date = moment().format('MMM D, YYYY');
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="pb-8 md:pb-12">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">
			<span class="text-rotate leading-relaxed">
				<span>
					<span>Welcome{user ? ` ${user.username}` : ''}!</span>
					<span>¡Bienvenido{user ? ` ${user.username}` : ''}!</span>
					<span>Bienvenue{user ? ` ${user.username}` : ''}!</span>
				</span>
			</span>
		</h1>
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
			<div class="stat-value tabular-nums">{current_time}</div>
			<div class="stat-desc">{current_date}</div>
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
				<div class="stat-value text-2xl">{location?.timezone ? to_short_timezone(location.timezone) : '--'}</div>
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
					<div class="stat-value text-base-content/60">--</div>
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
					<div class="stat-value text-base-content/60">--</div>
				{/if}
			</div>
		{/await}
	</div>
</div>
