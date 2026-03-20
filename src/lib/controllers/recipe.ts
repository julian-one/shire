import { Citadel } from '$lib/controllers/citadel';
import type { ListOptions, CreateRequest, UpdateRequest, Recipe } from '$lib/types/recipe';

export class RecipeController {
	async create(request: CreateRequest): Promise<string> {
		const response = await Citadel.post('/recipes', request);
		return response.data.recipe_id as string;
	}

	async list(options?: ListOptions): Promise<Recipe[]> {
		const response = await Citadel.get('/recipes', { params: options });
		return (response.data as Recipe[]) ?? [];
	}

	async by_id(id: string): Promise<Recipe> {
		const response = await Citadel.get(`/recipes/${id}`);
		return response.data as Recipe;
	}

	async update(id: string, request: UpdateRequest): Promise<void> {
		await Citadel.patch(`/recipes/${id}`, request);
	}

	async delete_recipe(id: string): Promise<void> {
		await Citadel.delete(`/recipes/${id}`);
	}

	async scan(image: File): Promise<Partial<Recipe>> {
		const form_data = new FormData();
		form_data.append('image', image);
		const response = await Citadel.post('/recipes/scan', form_data, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
		return response.data as Partial<Recipe>;
	}
}
