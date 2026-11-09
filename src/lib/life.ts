export class Life {
	cols: number;
	rows: number;

	cells: Uint8Array;

	private scratch: Uint8Array;

	constructor(cols: number, rows: number) {
		this.cols = cols;
		this.rows = rows;
		this.cells = new Uint8Array(cols * rows);
		this.scratch = new Uint8Array(cols * rows);
	}

	randomize(density: number) {
		for (let i = 0; i < this.cells.length; i++) {
			this.cells[i] = Math.random() < density ? 1 : 0;
		}
	}

	isAlive(x: number, y: number): boolean {
		return this.cells[y * this.cols + x] === 1;
	}

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

	step() {
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				const neighbours = this.countNeighbours(x, y);
				const alive = this.isAlive(x, y);

				let lives: boolean;
				if (alive) {
					lives = neighbours === 2 || neighbours === 3;
				} else {
					lives = neighbours === 3;
				}

				this.scratch[y * this.cols + x] = lives ? 1 : 0;
			}
		}

		const previous = this.cells;
		this.cells = this.scratch;
		this.scratch = previous;
	}

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
