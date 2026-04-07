import { Cuisine, Category, Unit } from '$lib/types/recipe';

export const cuisine_form_options = [
	{ value: '', label: 'None' },
	...Object.values(Cuisine).map((c) => ({ value: c, label: c }))
];

export const category_form_options = [
	{ value: '', label: 'None' },
	...Object.values(Category).map((c) => ({ value: c, label: c }))
];

export const unit_options = Object.values(Unit).map((u) => ({ value: u, label: u }));

const MINUTE_NS = 60 * 1000 * 1000 * 1000;

export function minutes_to_nanoseconds(mins: string): number | undefined {
	const n = parseInt(mins);
	return n ? n * MINUTE_NS : undefined;
}

export function nanoseconds_to_minutes(ns: number): string {
	return Math.round(ns / MINUTE_NS).toString();
}
