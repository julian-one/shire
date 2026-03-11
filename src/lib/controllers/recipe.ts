import { Citadel } from '$lib/controllers/citadel';
import type { ListOptions, CreateRequest, UpdateRequest, Recipe } from '$lib/types/recipe';

export class RecipeController {
	async Create(request: CreateRequest): Promise<string> {
		const response = await Citadel.post('/recipes', request);
		return response.data.recipe_id as string;
	}

	async List(options?: ListOptions): Promise<Recipe[]> {
		const response = await Citadel.get('/recipes', { params: options });
		return (response.data as Recipe[]) ?? [];
	}

	async ById(id: string): Promise<Recipe> {
		const response = await Citadel.get(`/recipes/${id}`);
		return response.data as Recipe;
	}

	async Update(id: string, request: UpdateRequest): Promise<void> {
		await Citadel.patch(`/recipes/${id}`, request);
	}

	async Delete(id: string): Promise<void> {
		await Citadel.delete(`/recipes/${id}`);
	}

	async Scan(image: File): Promise<Partial<Recipe>> {
		const formData = new FormData();
		formData.append('image', image);
		const response = await Citadel.post('/recipes/scan', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
		return response.data as Partial<Recipe>;
	}
}
