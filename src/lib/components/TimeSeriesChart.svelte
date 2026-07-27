<script lang="ts">
	import { ClusterController } from '$lib/controllers/cluster';

	type Props = {
		query: string;
		source?: 'prometheus' | 'loki';
		series_label?: string;
		range_seconds?: number;
		step?: string;
		refresh_ms?: number;
		value_suffix?: string;
		height?: number;
	};

	let {
		query,
		source = 'prometheus',
		series_label,
		range_seconds = 3600,
		step = '1m',
		refresh_ms = 30000,
		value_suffix = '',
		height = 240
	}: Props = $props();

	const cluster_controller = new ClusterController();

	let container = $state<HTMLDivElement | null>(null);
	let error = $state(false);

	// Resolve a CSS color expression (var()/color-mix()) to an sRGB rgb()/hex
	// string so charts honor the active DaisyUI theme. Modern browsers return
	// DaisyUI tokens from getComputedStyle as oklch(), which lightweight-charts'
	// color parser rejects — so normalize through a canvas, which serializes to
	// sRGB.
	function resolve_color(css_color: string): string {
		const probe = document.createElement('span');
		probe.style.color = css_color;
		probe.style.display = 'none';
		document.body.appendChild(probe);
		const computed = getComputedStyle(probe).color;
		probe.remove();

		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return computed || css_color;
		ctx.fillStyle = '#000000';
		ctx.fillStyle = computed || css_color;
		return ctx.fillStyle;
	}

	$effect(() => {
		if (typeof window === 'undefined' || !container) return;

		// Track props so a query/range change rebuilds the chart.
		const q = query;
		const src = source;
		const sl = series_label;
		const rs = range_seconds;
		const st = step;
		const refresh = refresh_ms;
		const suffix = value_suffix;
		const h = height;

		let active = true;
		let chart: any = null;
		let line_series: any = null;
		let interval: any = null;
		const series_map: Record<string, any> = {};

		const palette = [
			'var(--color-primary)',
			'var(--color-secondary)',
			'var(--color-accent)',
			'var(--color-info)',
			'var(--color-success)',
			'var(--color-warning)'
		].map(resolve_color);
		const text_color = resolve_color('var(--color-base-content)');
		const grid_color = resolve_color('color-mix(in oklch, var(--color-base-content) 8%, transparent)');

		function resize() {
			if (chart && container) chart.resize(container.clientWidth, h);
		}

		async function load() {
			if (!active || !chart) return;
			try {
				const data =
					src === 'loki'
						? await cluster_controller.fetch_loki_metrics(q, rs, st)
						: await cluster_controller.fetch_prometheus_metrics(q, rs, st);
				if (!active || !chart) return;
				if (!data || data.status !== 'success') {
					error = true;
					return;
				}
				const results = data.data?.result || [];
				results.forEach((r: any, i: number) => {
					const label =
						(sl && r.metric?.[sl]) ||
						r.metric?.node ||
						r.metric?.instance ||
						r.metric?.__name__ ||
						`series ${i}`;
					let series = series_map[label];
					if (!series) {
						series = chart.addSeries(line_series, {
							color: palette[i % palette.length],
							lineWidth: 2,
							title: label
						});
						series_map[label] = series;
					}

					const seen = new Set<number>();
					const points = (r.values || [])
						.map((v: any) => ({ time: parseInt(v[0]), value: parseFloat(v[1]) }))
						.filter((p: any) => Number.isFinite(p.time) && Number.isFinite(p.value))
						.sort((a: any, b: any) => a.time - b.time)
						.filter((p: any) => (seen.has(p.time) ? false : (seen.add(p.time), true)));

					series.setData(points);
				});
				error = false;
			} catch (err) {
				console.error('TimeSeriesChart load failed:', err);
				error = true;
			}
		}

		import('lightweight-charts').then(async (module) => {
			if (!active || !container) return;
			const { createChart, LineSeries } = module;
			line_series = LineSeries;

			chart = createChart(container, {
				height: h,
				layout: { background: { color: 'transparent' }, textColor: text_color },
				grid: { vertLines: { color: grid_color }, horzLines: { color: grid_color } },
				timeScale: { timeVisible: true, secondsVisible: false, borderVisible: false },
				rightPriceScale: { borderVisible: false },
				crosshair: { vertLine: { labelVisible: false } },
				localization: { priceFormatter: (val: number) => val.toFixed(1) + suffix }
			});

			window.addEventListener('resize', resize);
			await load();
			resize();

			if (refresh > 0) {
				interval = setInterval(load, refresh);
			}
		});

		return () => {
			active = false;
			window.removeEventListener('resize', resize);
			if (interval) clearInterval(interval);
			if (chart) {
				try {
					chart.remove();
				} catch (e) {}
				chart = null;
			}
		};
	});
</script>

<div class="relative w-full" style="height: {height}px">
	<div bind:this={container} class="h-full w-full"></div>
	{#if error}
		<div class="absolute inset-0 flex items-center justify-center text-base-content/40 text-xs">
			No metric data
		</div>
	{/if}
</div>
