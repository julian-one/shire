<script lang="ts">
	import { onMount } from 'svelte';
	import { Life } from './life';

	// Size of one cell in CSS pixels, the gap around each cell, and how often the grid steps.
	const cell = 22;
	const inset = 3;
	const interval = 240;

	// Chance a cell starts alive, and how many generations between gliders.
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

		// Paint every live cell as a rounded square in the current text colour.
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

		// Match the grid to the element size and the canvas to the device pixel ratio.
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

		// Runs every animation frame but only steps the grid once per interval.
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
	class="pointer-events-none absolute inset-0 -z-10 size-full text-base-300 opacity-60"
	aria-hidden="true"
></canvas>
