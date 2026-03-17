const FRACTION_MAP: [number, string][] = [
	[1 / 8, '1/8'],
	[1 / 4, '1/4'],
	[1 / 3, '1/3'],
	[3 / 8, '3/8'],
	[1 / 2, '1/2'],
	[5 / 8, '5/8'],
	[2 / 3, '2/3'],
	[3 / 4, '3/4'],
	[7 / 8, '7/8']
];

const TOLERANCE = 0.01;

export function float_to_fraction(value: number): string {
	if (value < 0) return '-' + float_to_fraction(-value);
	if (value === 0) return '0';

	const whole = Math.floor(value);
	const remainder = value - whole;

	if (remainder < TOLERANCE) {
		return whole.toString();
	}

	for (const [float_val, fraction_str] of FRACTION_MAP) {
		if (Math.abs(remainder - float_val) < TOLERANCE) {
			return whole > 0 ? `${whole} ${fraction_str}` : fraction_str;
		}
	}

	return parseFloat(value.toFixed(2)).toString();
}

export function fraction_to_float(input: string): number {
	const trimmed = input.trim();
	if (!trimmed) return 0;

	const as_number = Number(trimmed);
	if (!isNaN(as_number)) return as_number;

	const match = trimmed.match(/^(\d+)?\s*(\d+)\s*\/\s*(\d+)$/);
	if (match) {
		const whole = match[1] ? parseInt(match[1]) : 0;
		const numerator = parseInt(match[2]);
		const denominator = parseInt(match[3]);
		if (denominator === 0) return 0;
		return whole + numerator / denominator;
	}

	return 0;
}
