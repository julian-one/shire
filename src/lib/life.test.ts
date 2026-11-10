import { describe, expect, it } from 'vitest';
import { Life } from './life.js';

describe('step', () => {
	it('turns a horizontal blinker vertical', () => {
		const life = new Life(5, 5);
		life.setAlive(1, 2, true);
		life.setAlive(2, 2, true);
		life.setAlive(3, 2, true);

		life.step();

		expect(life.isAlive(2, 1)).toBe(true);
		expect(life.isAlive(2, 2)).toBe(true);
		expect(life.isAlive(2, 3)).toBe(true);
		expect(life.isAlive(1, 2)).toBe(false);
		expect(life.isAlive(3, 2)).toBe(false);
	});

	it('wraps around the edges', () => {
		const life = new Life(5, 5);
		life.setAlive(4, 2, true);
		life.setAlive(0, 2, true);
		life.setAlive(1, 2, true);

		life.step();

		expect(life.isAlive(0, 1)).toBe(true);
		expect(life.isAlive(0, 2)).toBe(true);
		expect(life.isAlive(0, 3)).toBe(true);
		expect(life.isAlive(4, 2)).toBe(false);
		expect(life.isAlive(1, 2)).toBe(false);
	});

	it('does nothing on an empty grid', () => {
		const life = new Life(0, 0, { gliderEvery: 1 });

		life.step();

		expect(life.isAlive(0, 0)).toBe(false);
	});
});

describe('cells outside the grid', () => {
	it('reads as dead', () => {
		const life = new Life(5, 5);
		life.randomize(1);

		expect(life.isAlive(-1, 0)).toBe(false);
		expect(life.isAlive(5, 0)).toBe(false);
		expect(life.isAlive(0, -1)).toBe(false);
		expect(life.isAlive(0, 5)).toBe(false);
	});

	it('ignores writes', () => {
		const life = new Life(5, 5);

		life.setAlive(5, 0, true);
		life.setAlive(-1, 1, true);

		expect(life.isAlive(0, 1)).toBe(false);
		expect(life.isAlive(4, 0)).toBe(false);
	});
});

describe('randomize', () => {
	it('fills cells whose draw falls under the density', () => {
		const life = new Life(4, 4, {
			random: () => {
				return 0.5;
			}
		});

		life.randomize(0.6);
		expect(life.isAlive(0, 0)).toBe(true);
		expect(life.isAlive(3, 3)).toBe(true);

		life.randomize(0.4);
		expect(life.isAlive(0, 0)).toBe(false);
		expect(life.isAlive(3, 3)).toBe(false);
	});
});

describe('seedRing', () => {
	const area = { left: 4, top: 4, right: 8, bottom: 8 };

	it('is densest on the edge of the area', () => {
		const life = new Life(12, 12, {
			random: () => {
				return 0.5;
			}
		});

		life.seedRing(area);

		expect(life.isAlive(4, 4)).toBe(true);
		expect(life.isAlive(7, 6)).toBe(true);
		expect(life.isAlive(5, 5)).toBe(false);
		expect(life.isAlive(3, 4)).toBe(false);
	});

	it('seeds the same reach on every side and leaves the middle sparse', () => {
		const life = new Life(12, 12, {
			random: () => {
				return 0.2;
			}
		});

		life.seedRing(area);

		expect(life.isAlive(1, 5)).toBe(true);
		expect(life.isAlive(0, 5)).toBe(false);
		expect(life.isAlive(10, 5)).toBe(true);
		expect(life.isAlive(11, 5)).toBe(false);
		expect(life.isAlive(5, 1)).toBe(true);
		expect(life.isAlive(5, 0)).toBe(false);
		expect(life.isAlive(5, 10)).toBe(true);
		expect(life.isAlive(5, 11)).toBe(false);
		expect(life.isAlive(5, 5)).toBe(false);
	});

	it('clips at the grid edge', () => {
		const life = new Life(8, 8, {
			random: () => {
				return 0.2;
			}
		});

		life.seedRing({ left: 0, top: 0, right: 2, bottom: 2 });

		expect(life.isAlive(2, 0)).toBe(true);
		expect(life.isAlive(7, 0)).toBe(false);
		expect(life.isAlive(0, 7)).toBe(false);
	});
});

describe('hide', () => {
	it('hides live cells without killing them', () => {
		const life = new Life(5, 5);
		life.setAlive(1, 1, true);
		life.setAlive(3, 3, true);

		life.hide([{ left: 0, top: 0, right: 2, bottom: 2 }]);

		expect(life.isAlive(1, 1)).toBe(true);
		expect(life.isVisible(1, 1)).toBe(false);
		expect(life.isVisible(3, 3)).toBe(true);
		expect(life.isVisible(2, 2)).toBe(false);
	});

	it('lets hidden cells keep evolving', () => {
		const life = new Life(5, 5);
		life.setAlive(1, 2, true);
		life.setAlive(2, 2, true);
		life.setAlive(3, 2, true);
		life.hide([{ left: 0, top: 0, right: 5, bottom: 5 }]);

		life.step();

		expect(life.isAlive(2, 1)).toBe(true);
		expect(life.isVisible(2, 1)).toBe(false);
	});

	it('shows cells again when the areas are replaced', () => {
		const life = new Life(5, 5);
		life.setAlive(1, 1, true);
		life.hide([{ left: 0, top: 0, right: 2, bottom: 2 }]);

		life.hide([]);

		expect(life.isVisible(1, 1)).toBe(true);
	});
});

describe('glider cadence', () => {
	it('spawns a glider every given number of generations', () => {
		const life = new Life(8, 8, {
			gliderEvery: 2,
			random: () => {
				return 0;
			}
		});

		life.step();
		expect(life.isAlive(0, 0)).toBe(false);

		life.step();
		expect(life.isAlive(0, 0)).toBe(true);
		expect(life.isAlive(1, 0)).toBe(true);
		expect(life.isAlive(2, 0)).toBe(true);
		expect(life.isAlive(2, 1)).toBe(true);
		expect(life.isAlive(1, 2)).toBe(true);
	});

	it('wraps a glider spawned at the far corner', () => {
		const life = new Life(8, 8, {
			gliderEvery: 1,
			random: () => {
				return 0.99;
			}
		});

		life.step();

		expect(life.isAlive(7, 7)).toBe(true);
		expect(life.isAlive(0, 7)).toBe(true);
		expect(life.isAlive(1, 7)).toBe(true);
		expect(life.isAlive(1, 0)).toBe(true);
		expect(life.isAlive(0, 1)).toBe(true);
	});

	it('spawns nothing without a cadence', () => {
		const life = new Life(8, 8, {
			random: () => {
				return 0;
			}
		});

		life.step();
		life.step();

		expect(life.isAlive(0, 0)).toBe(false);
	});
});
