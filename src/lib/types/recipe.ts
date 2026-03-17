export enum Cuisine {
	American = 'American',
	Chinese = 'Chinese',
	French = 'French',
	Indian = 'Indian',
	Italian = 'Italian',
	Japanese = 'Japanese',
	Vietnamese = 'Vietnamese'
}

export enum Category {
	Appetizer = 'Appetizer',
	Main = 'Main',
	Dessert = 'Dessert',
	Beverage = 'Beverage',
	Side = 'Side'
}

export enum Unit {
	Tsp = 'tsp',
	Tbsp = 'tbsp',
	Cup = 'cup',
	FlOz = 'fl oz',
	Pt = 'pt',
	Qt = 'qt',
	Gal = 'gal',
	Ml = 'ml',
	L = 'l',
	Pinch = 'pinch',
	Dash = 'dash',
	Oz = 'oz',
	Lb = 'lb',
	G = 'g',
	Kg = 'kg',
	Whole = 'whole'
}

export type Ingredient = {
	ingredient_id?: string;
	recipe_id?: string;
	amount: number;
	unit: Unit;
	item: string;
};

export type FormIngredient = { amount: string; unit: Unit; item: string };

export type Recipe = {
	recipe_id: string;
	user_id: string;
	title: string;
	description?: string;
	photo_url?: string;
	source_url?: string;
	ingredients: Ingredient[];
	instructions: string[];
	cook_time?: number;
	serves?: number;
	cuisine?: Cuisine;
	category?: Category;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
};

export type CreateRequest = {
	user_id: string;
	title: string;
	description?: string;
	photo_url?: string;
	source_url?: string;
	ingredients: Ingredient[];
	instructions: string[];
	cook_time?: number;
	serves?: number;
	cuisine?: Cuisine;
	category?: Category;
};

export type UpdateRequest = {
	title?: string;
	description?: string;
	photo_url?: string;
	source_url?: string;
	ingredients?: Ingredient[];
	instructions?: string[];
	cook_time?: number;
	serves?: number;
	cuisine?: Cuisine | '';
	category?: Category | '';
};

export type ListOptions = {
	search?: string;
	order_by?: string;
	cuisine?: string;
	category?: string;
};
