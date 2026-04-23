import { Citadel } from '$lib/controllers/citadel';
import type {
	ListOptions,
	CreateRequest,
	UpdateRequest,
	Recipe,
	Bookmark,
	CreateRecipeReviewRequest,
	RecipeReview
} from '$lib/types/recipe';
import type { PaginatedResponse } from '$lib/types/database';

export class RecipeController {
	async create(request: CreateRequest): Promise<string> {
		const response = await Citadel.post('/recipes', request);
		return response.data.recipe_id as string;
	}

	async list(options?: ListOptions): Promise<PaginatedResponse<Recipe>> {
		const response = await Citadel.get('/recipes', { params: options });
		return response.data as PaginatedResponse<Recipe>;
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

	async list_bookmarks(): Promise<Bookmark[]> {
		const response = await Citadel.get('/recipes/bookmarks');
		return (response.data as Bookmark[]) ?? [];
	}

	async create_recipe_review(recipe_id: string, request: CreateRecipeReviewRequest): Promise<string> {
		const response = await Citadel.post(`/recipes/${recipe_id}/reviews`, request);
		return response.data.review_id as string;
	}

	async list_recipe_reviews(recipe_id: string): Promise<RecipeReview[]> {
		const response = await Citadel.get(`/recipes/${recipe_id}/reviews`);
		return (response.data as RecipeReview[]) ?? [];
	}

	async delete_recipe_review(review_id: string): Promise<void> {
		await Citadel.delete(`/recipe-reviews/${review_id}`);
	}
}
