import { float_to_fraction } from './fraction';

/**
 * Format an ingredient for human-readable display.
 *
 * Rules:
 *  - amount 0 + no unit → just the item ("freshly ground black pepper")
 *  - unit "whole"        → drop the unit ("4 eggs" not "4 whole eggs")
 *  - unit "pinch"/"dash" → "a pinch of salt", "a dash of paprika"
 *  - otherwise           → "1/2 cup mayonnaise"
 */
export function format_ingredient(amount: number, unit: string, item: string): { amount_unit: string; item: string } {
	// No amount and no unit — just the item
	if (amount === 0 && (!unit || unit === '')) {
		return { amount_unit: '', item };
	}

	// Pinch / dash — use "a pinch of" / "a dash of"
	if (unit === 'pinch' || unit === 'dash') {
		if (amount <= 1) {
			return { amount_unit: `a ${unit} of`, item };
		}
		return { amount_unit: `${float_to_fraction(amount)} ${unit}es of`, item };
	}

	// "whole" — drop the unit label
	if (unit === 'whole') {
		return { amount_unit: float_to_fraction(amount), item };
	}

	// Standard: "1/2 cup"
	const fraction = float_to_fraction(amount);
	return { amount_unit: `${fraction} ${unit}`, item };
}
