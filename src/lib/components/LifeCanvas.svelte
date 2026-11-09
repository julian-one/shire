<script lang="ts">
	import { onMount } from 'svelte';
	import { Life } from '#lib/life.js';

	const cell = 22;
	const inset = 3;
	const interval = 240;

	const density = 0.16;
	const gliderEvery = 60;

	let canvas: HTMLCanvasElement | undefined;

	onMount(() => {
		const target = canvas;
		if (!target) {
			return;
		}
		const context = target.getContext('2d');
		if (!context) {
			return;
		}

		let life = new Life(0, 0);
		let scale = 1;
		let generation = 0;
		let last = 0;
		let frame = 0;

		const draw = () => {
			const size = cell * scale;
			const gap = inset * scale;
			context.clearRect(0, 0, target.width, target.height);
			context.fillStyle = getComputedStyle(target).color;
			for (let y = 0; y < life.rows; y++) {
				for (let x = 0; x < life.cols; x++) {
					if (!life.isAlive(x, y)) {
						continue;
					}
					context.beginPath();
					context.roundRect(x * size + gap, y * size + gap, size - gap * 2, size - gap * 2, gap);
					context.fill();
				}
			}
		};

		const resize = () => {
			const width = target.clientWidth;
			const height = target.clientHeight;
			if (!width || !height) {
				return;
			}
			const cols = Math.ceil(width / cell);
			const rows = Math.ceil(height / cell);
			if (cols !== life.cols || rows !== life.rows) {
				life = new Life(cols, rows);
				life.randomize(density);
			}
			scale = window.devicePixelRatio;
			target.width = Math.round(width * scale);
			target.height = Math.round(height * scale);
			draw();
		};

		const tick = (time: number) => {
			frame = requestAnimationFrame(tick);
			if (time - last < interval) {
				return;
			}
			last = time;
			life.step();
			generation++;
			if (generation % gliderEvery === 0) {
				const x = Math.floor(Math.random() * life.cols);
				const y = Math.floor(Math.random() * life.rows);
				life.spawnGlider(x, y);
			}
			draw();
		};

		const observer = new ResizeObserver(resize);
		observer.observe(target);
		resize();
		frame = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none absolute inset-0 -z-10 size-full text-base-300 opacity-60 dark:opacity-45"
	aria-hidden="true"
></canvas>
