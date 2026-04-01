import { Citadel } from '$lib/controllers/citadel';
import type {
	ListOptions,
	CreateRequest,
	UpdateRequest,
	Recipe,
	CreateRecipeLogRequest,
	RecipeLog
} from '$lib/types/recipe';

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

	async bookmark(recipe_id: string): Promise<void> {
		await Citadel.put(`/recipes/${recipe_id}/bookmark`);
	}

	async unbookmark(recipe_id: string): Promise<void> {
		await Citadel.delete(`/recipes/${recipe_id}/bookmark`);
	}

	async is_bookmarked(recipe_id: string): Promise<boolean> {
		const response = await Citadel.get(`/recipes/${recipe_id}/bookmark`);
		return response.data.bookmarked as boolean;
	}

	async list_bookmarked_ids(): Promise<string[]> {
		const response = await Citadel.get('/recipes/bookmarks');
		return (response.data as string[]) ?? [];
	}

	async create_recipe_log(recipe_id: string, request: CreateRecipeLogRequest): Promise<string> {
		const response = await Citadel.post(`/recipes/${recipe_id}/logs`, request);
		return response.data.log_id as string;
	}

	async list_recipe_logs(recipe_id: string): Promise<RecipeLog[]> {
		const response = await Citadel.get(`/recipes/${recipe_id}/logs`);
		return (response.data as RecipeLog[]) ?? [];
	}

	async delete_recipe_log(log_id: string): Promise<void> {
		await Citadel.delete(`/recipe-logs/${log_id}`);
	}
}
