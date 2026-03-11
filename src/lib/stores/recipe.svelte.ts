import { RecipeController } from '$lib/controllers/recipe';
import { AlertStore } from '$lib/stores/alert.svelte';
import type { CreateRequest, UpdateRequest, Recipe } from '$lib/types/recipe';

class SingleRecipe {
	private recipe_controller = new RecipeController();

	loading: boolean = $state(false);

	async create(request: CreateRequest): Promise<string | null> {
		this.loading = true;
		try {
			const recipe_id = await this.recipe_controller.Create(request);
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
			await this.recipe_controller.Update(id, request);
			AlertStore.add('Recipe updated successfully', 'success');
			return true;
		} catch {
			AlertStore.add('Failed to update recipe', 'error');
			return false;
		} finally {
			this.loading = false;
		}
	}

	async delete(id: string): Promise<boolean> {
		this.loading = true;
		try {
			await this.recipe_controller.Delete(id);
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
			const result = await this.recipe_controller.Scan(image);
			AlertStore.add('Recipe scanned successfully', 'success');
			return result;
		} catch {
			AlertStore.add('Failed to scan recipe', 'error');
			return null;
		} finally {
			this.loading = false;
		}
	}
}

export const RecipeStore = new SingleRecipe();
