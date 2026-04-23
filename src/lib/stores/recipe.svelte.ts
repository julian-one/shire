import { RecipeController } from '$lib/controllers/recipe';
import { AlertStore } from '$lib/stores/alert.svelte';
import type { CreateRequest, UpdateRequest, Recipe, CreateRecipeReviewRequest, RecipeReview } from '$lib/types/recipe';

class SingleRecipe {
	private recipe_controller = new RecipeController();

	loading: boolean = $state(false);

	async create(request: CreateRequest): Promise<string | null> {
		this.loading = true;
		try {
			const recipe_id = await this.recipe_controller.create(request);
			AlertStore.add('Recipe created successfully', 'success');
			return recipe_id;
		} catch {
			AlertStore.add('Failed to create recipe', 'error');
			return null;
		} finally {
			this.loading = false;
		}
	}

	async update(id: string, request: UpdateRequest): Promise<boolean> {
		this.loading = true;
		try {
			await this.recipe_controller.update(id, request);
			AlertStore.add('Recipe updated successfully', 'success');
			return true;
		} catch {
			AlertStore.add('Failed to update recipe', 'error');
			return false;
		} finally {
			this.loading = false;
		}
	}

	async delete_recipe(id: string): Promise<boolean> {
		this.loading = true;
		try {
			await this.recipe_controller.delete_recipe(id);
			AlertStore.add('Recipe deleted successfully', 'success');
			return true;
		} catch {
			AlertStore.add('Failed to delete recipe', 'error');
			return false;
		} finally {
			this.loading = false;
		}
	}

	async scan(image: File): Promise<Partial<Recipe> | null> {
		this.loading = true;
		try {
			const result = await this.recipe_controller.scan(image);
			AlertStore.add('Recipe scanned successfully', 'success');
			return result;
		} catch {
			AlertStore.add('Failed to scan recipe', 'error');
			return null;
		} finally {
			this.loading = false;
		}
	}

	async bookmark(recipe_id: string): Promise<boolean> {
		try {
			await this.recipe_controller.bookmark(recipe_id);
			return true;
		} catch {
			AlertStore.add('Failed to bookmark recipe', 'error');
			return false;
		}
	}

	async unbookmark(recipe_id: string): Promise<boolean> {
		try {
			await this.recipe_controller.unbookmark(recipe_id);
			return true;
		} catch {
			AlertStore.add('Failed to remove bookmark', 'error');
			return false;
		}
	}

	async create_recipe_review(recipe_id: string, request: CreateRecipeReviewRequest): Promise<string | null> {
		this.loading = true;
		try {
			const review_id = await this.recipe_controller.create_recipe_review(recipe_id, request);
			AlertStore.add('Review saved', 'success');
			return review_id;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { error?: string } } };
			const msg = err?.response?.data?.error || 'Failed to save review';
			AlertStore.add(msg, 'error');
			return null;
		} finally {
			this.loading = false;
		}
	}

	async list_recipe_reviews(recipe_id: string): Promise<RecipeReview[]> {
		try {
			return await this.recipe_controller.list_recipe_reviews(recipe_id);
		} catch {
			return [];
		}
	}

	async delete_recipe_review(review_id: string): Promise<boolean> {
		try {
			await this.recipe_controller.delete_recipe_review(review_id);
			AlertStore.add('Review deleted', 'success');
			return true;
		} catch {
			AlertStore.add('Failed to delete review', 'error');
			return false;
		}
	}
}

export const RecipeStore = new SingleRecipe();
