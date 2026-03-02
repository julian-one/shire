import { RecipeController } from '$lib/controllers/recipe';
import { AlertStore } from '$lib/stores/alert.svelte';
import type { Ingredient, ScanResult } from '$lib/types/recipe';
import axios from 'axios';

class SingleRecipe {
	private recipe_controller = new RecipeController();

	loading: boolean = $state(false);
	scan_error: string | null = $state(null);

	async create(
		user_id: string,
		title: string,
		description: string,
		ingredients: Ingredient[],
		instructions: string[],
		cook_time: string,
		serves: string,
		cuisine: string
	): Promise<string | null> {
		this.loading = true;
		try {
			const recipe_id = await this.recipe_controller.Create({
				user_id,
				title,
				description,
				ingredients,
				instructions,
				cook_time,
				serves,
				cuisine
			});
			AlertStore.add('Recipe created successfully', 'success');
			return recipe_id;
		} catch {
			AlertStore.add('Failed to create recipe', 'error');
			return null;
		} finally {
			this.loading = false;
		}
	}

	async update(
		id: string,
		title: string,
		description: string,
		ingredients: Ingredient[],
		instructions: string[],
		cook_time: string,
		serves: string,
		cuisine: string
	): Promise<boolean> {
		this.loading = true;
		try {
			await this.recipe_controller.Update(id, {
				title,
				description,
				ingredients,
				instructions,
				cook_time,
				serves,
				cuisine
			});
			AlertStore.add('Recipe updated successfully', 'success');
			return true;
		} catch {
			AlertStore.add('Failed to update recipe', 'error');
			return false;
		} finally {
			this.loading = false;
		}
	}

	async scan(file: File): Promise<ScanResult | null> {
		this.loading = true;
		this.scan_error = null;
		try {
			const result = await this.recipe_controller.Scan(file);
			AlertStore.add('Recipe scanned successfully', 'success');
			return result;
		} catch (err) {
			const message =
				axios.isAxiosError(err) && err.response?.data?.error
					? err.response.data.error
					: 'Failed to scan recipe';
			this.scan_error = message;
			AlertStore.add(message, 'error');
			return null;
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
}

export const RecipeStore = new SingleRecipe();
