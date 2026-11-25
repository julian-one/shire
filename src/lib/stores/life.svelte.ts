import { untrack } from 'svelte';
import { prefersReducedMotion } from 'svelte/motion';
import { Canvas, Grid, Simulation } from '@julianone/gol';
import type { GridSize } from '@julianone/gol';

class LifeStore {
	running = $state(true);
	speed = $state(4);
	cellSize = $state(10);
	generation = $state(0);
	population = $state(0);
	private canvas: Canvas | undefined;
	private simulation: Simulation | undefined;
	private gridSize: GridSize | undefined;
	private drawn = 0;
	private stepping = false;
	private mounted = false;

	attach = (element: HTMLCanvasElement) => {
		untrack(() => {
			if (!this.mounted) {
				this.running = !prefersReducedMotion.current;
			}
			this.mounted = true;

			this.canvas = new Canvas(element, this.cellSize);
			this.restart();
		});

		// A simulation reads the size of its grid once, so a canvas that now fits a different
		// number of cells needs a new one.
		const observer = new ResizeObserver(() => {
			if (!this.canvas || !this.gridSize) {
				return;
			}
			const size = this.canvas.gridSize();
			if (size.cols !== this.gridSize.cols || size.rows !== this.gridSize.rows) {
				this.restart();
			}
		});
		observer.observe(element);

		return () => {
			observer.disconnect();
			if (this.simulation) {
				this.simulation.stop();
			}
			this.canvas = undefined;
			this.simulation = undefined;
			this.gridSize = undefined;
		};
	};

	toggle(): void {
		if (!this.simulation) {
			return;
		}
		this.simulation.stop();
		this.stepping = false;
		if (this.running) {
			this.running = false;
		} else {
			this.running = true;
			this.simulation.start(1000 / this.speed);
		}
	}

	// A simulation only advances on its timer, so a step runs the timer for a single drawing.
	step(): void {
		if (!this.simulation || this.running) {
			return;
		}
		this.stepping = true;
		this.simulation.start(0);
	}

	setSpeed(speed: number): void {
		if (!this.simulation || !(speed > 0)) {
			return;
		}
		this.speed = speed;
		if (this.running) {
			this.simulation.stop();
			this.simulation.start(1000 / speed);
		}
	}

	// A different cell size fits a different number of cells, so the simulation starts over.
	setCellSize(cellSize: number): void {
		if (!this.canvas || !(cellSize > 0)) {
			return;
		}
		this.cellSize = cellSize;
		this.canvas.cellSize = cellSize;
		this.restart();
	}

	// Replaces the simulation with a new one on an empty grid as large as the canvas fits now.
	private restart(): void {
		const canvas = this.canvas;
		if (!canvas) {
			return;
		}
		if (this.simulation) {
			this.simulation.stop();
		}

		const size = canvas.gridSize();
		// The simulation draws through this display instead of straight on the canvas, so the
		// counts on the page are updated every time a generation is shown.
		const simulation = new Simulation({
			gridSize: () => {
				return size;
			},
			draw: (grid) => {
				canvas.draw(grid);
				this.generation = this.drawn;
				this.population = grid.population();
				this.drawn += 1;
				if (this.stepping) {
					this.stepping = false;
					simulation.stop();
				}
			}
		});
		this.simulation = simulation;
		this.gridSize = size;
		this.drawn = 0;
		this.stepping = false;
		this.generation = 0;
		this.population = 0;

		// The simulation draws nothing until its first tick, so clear what the last one left.
		canvas.draw(new Grid(size.cols, size.rows));
		if (this.running) {
			simulation.start(1000 / this.speed);
		}
	}
}

export const life = new LifeStore();
