// Conway's Game of Life on a grid that wraps at the edges (a torus).
//
// The rules, applied to every cell at once each generation:
//   1. A live cell with fewer than two live neighbours dies (underpopulation).
//   2. A live cell with two or three live neighbours survives.
//   3. A live cell with more than three live neighbours dies (overpopulation).
//   4. A dead cell with exactly three live neighbours becomes alive (reproduction).
export class Life {
	cols: number;
	rows: number;

	// One byte per cell: 1 is alive, 0 is dead. Index is y * cols + x.
	cells: Uint8Array;

	// Second buffer so a generation is computed from the old state only.
	private scratch: Uint8Array;

	constructor(cols: number, rows: number) {
		this.cols = cols;
		this.rows = rows;
		this.cells = new Uint8Array(cols * rows);
		this.scratch = new Uint8Array(cols * rows);
	}

	// Fill the grid at random. density is the chance each cell starts alive.
	randomize(density: number) {
		for (let i = 0; i < this.cells.length; i++) {
			this.cells[i] = Math.random() < density ? 1 : 0;
		}
	}

	isAlive(x: number, y: number): boolean {
		return this.cells[y * this.cols + x] === 1;
	}

	// Count the live cells in the eight surrounding positions, wrapping at the edges.
	countNeighbours(x: number, y: number): number {
		let count = 0;
		for (let dy = -1; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				if (dx === 0 && dy === 0) {
					continue;
				}
				const nx = (x + dx + this.cols) % this.cols;
				const ny = (y + dy + this.rows) % this.rows;
				count += this.cells[ny * this.cols + nx];
			}
		}
		return count;
	}

	// Advance the grid by one generation.
	step() {
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				const neighbours = this.countNeighbours(x, y);
				const alive = this.isAlive(x, y);

				let lives: boolean;
				if (alive) {
					// Rules 1 to 3: only two or three neighbours keep a cell alive.
					lives = neighbours === 2 || neighbours === 3;
				} else {
					// Rule 4: exactly three neighbours bring a dead cell to life.
					lives = neighbours === 3;
				}

				this.scratch[y * this.cols + x] = lives ? 1 : 0;
			}
		}

		// Swap buffers so the new generation becomes the current one.
		const previous = this.cells;
		this.cells = this.scratch;
		this.scratch = previous;
	}

	// Not one of the rules. Drops a glider at (x, y) to keep a quiet grid moving.
	spawnGlider(x: number, y: number) {
		const glider = [
			[0, 0],
			[1, 0],
			[2, 0],
			[2, 1],
			[1, 2]
		];
		for (const [dx, dy] of glider) {
			const gx = (x + dx) % this.cols;
			const gy = (y + dy) % this.rows;
			this.cells[gy * this.cols + gx] = 1;
		}
	}
}
