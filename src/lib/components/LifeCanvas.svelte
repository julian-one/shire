<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { Life } from '#lib/life.js';
	import type { Area } from '#lib/types/life.js';

	const cell = 22;
	const inset = 3;
	const interval = 240;

	const density = 0.16;
	const gliderEvery = 60;
	const clearMargin = 24;

	const animate = (canvas: HTMLCanvasElement) => {
		const context = canvas.getContext('2d');
		if (!context) {
			return;
		}

		let life = new Life(0, 0);
		let scale = 1;
		let last = 0;
		let frame = 0;

		const clearAreas = () => {
			const areas: Area[] = [];
			const origin = canvas.getBoundingClientRect();
			const hosts = document.querySelectorAll('[data-life-clear]');
			for (const host of hosts) {
				for (const child of host.children) {
					const rect = child.getBoundingClientRect();
					if (!rect.width || !rect.height) {
						continue;
					}
					areas.push({
						left: Math.floor((rect.left - origin.left - clearMargin) / cell),
						top: Math.floor((rect.top - origin.top - clearMargin) / cell),
						right: Math.ceil((rect.right - origin.left + clearMargin) / cell),
						bottom: Math.ceil((rect.bottom - origin.top + clearMargin) / cell)
					});
				}
			}
			return areas;
		};

		const seedPortrait = () => {
			const portrait = document.querySelector('[data-life-seed]');
			if (!portrait) {
				return;
			}
			const origin = canvas.getBoundingClientRect();
			const rect = portrait.getBoundingClientRect();
			life.seedRing({
				left: Math.floor((rect.left - origin.left) / cell),
				top: Math.floor((rect.top - origin.top) / cell),
				right: Math.ceil((rect.right - origin.left) / cell),
				bottom: Math.ceil((rect.bottom - origin.top) / cell)
			});
		};

		const draw = () => {
			const size = cell * scale;
			const gap = inset * scale;
			life.hide(clearAreas());
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = getComputedStyle(canvas).color;
			context.beginPath();
			for (let y = 0; y < life.rows; y++) {
				for (let x = 0; x < life.cols; x++) {
					if (!life.isVisible(x, y)) {
						continue;
					}
					context.roundRect(x * size + gap, y * size + gap, size - gap * 2, size - gap * 2, gap);
				}
			}
			context.fill();
		};

		const resize = () => {
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			if (!width || !height) {
				return;
			}
			const cols = Math.ceil(width / cell);
			const rows = Math.ceil(height / cell);
			if (cols !== life.cols || rows !== life.rows) {
				life = new Life(cols, rows, { gliderEvery });
				life.randomize(density);
				seedPortrait();
			}
			scale = window.devicePixelRatio;
			canvas.width = Math.round(width * scale);
			canvas.height = Math.round(height * scale);
			draw();
		};

		const tick = (time: number) => {
			frame = requestAnimationFrame(tick);
			if (time - last < interval) {
				return;
			}
			last = time;
			life.step();
			draw();
		};

		const observer = new ResizeObserver(resize);
		observer.observe(canvas);
		resize();
		frame = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		};
	};
</script>

{#if !prefersReducedMotion.current}
	<canvas
		{@attach animate}
		class="pointer-events-none absolute inset-0 -z-10 size-full text-base-300 opacity-60 dark:opacity-45"
		aria-hidden="true"
	></canvas>
{/if}
