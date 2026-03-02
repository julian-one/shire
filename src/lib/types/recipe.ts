export type Ingredient = {
	amount: string;
	unit: string;
	item: string;
};

export type Recipe = {
	recipe_id: string;
	user_id: string;
	title: string;
	description: string;
	ingredients: Ingredient[];
	instructions: string[];
	cook_time: string;
	serves: string;
	cuisine: string;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date | null;
};

export type CreateRequest = {
	user_id: string;
	title: string;
	description: string;
	ingredients: Ingredient[];
	instructions: string[];
	cook_time: string;
	serves: string;
	cuisine: string;
};

export type UpdateRequest = {
	title?: string;
	description?: string;
	ingredients?: Ingredient[];
	instructions?: string[];
	cook_time?: string;
	serves?: string;
	cuisine?: string;
};

export type ListOptions = {
	search?: string;
	order_by?: string;
};

export type ScanResult = {
	title: string;
	ingredients: Ingredient[];
	instructions: string[];
	yield: string;
	prep_time?: string;
	cook_time?: string;
};
