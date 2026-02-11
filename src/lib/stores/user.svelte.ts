import { UserController } from '$lib/controllers/user';
import type { EditableFields, User } from '$lib/types/user';
import { AlertStore } from '$lib/stores/alert.svelte';

class SingleUser {
	private user_controller = new UserController();

	user: User | null = $state(null);
	loading: boolean = $state(false);

	async load_user(user_id: string) {
		if (!user_id) return;

		this.loading = true;
		try {
			this.user = await this.user_controller.ById(user_id);
		} catch {
			AlertStore.add('Failed to load user data', 'error');
		} finally {
			this.loading = false;
		}
	}

	async update_user(user_id: string, changes: EditableFields): Promise<User | null> {
		if (!user_id) return null;

		this.loading = true;
		try {
			const updated = await this.user_controller.Update(user_id, changes);
			this.user = updated;
			return updated;
		} catch {
			AlertStore.add('Failed to update user data', 'error');
			return null;
		} finally {
			this.loading = false;
		}
	}
}

export const UserStore = new SingleUser();
