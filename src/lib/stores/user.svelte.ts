import { UserController } from '$lib/controllers/user';
import type { User } from '$lib/types/user';
import { AlertStore } from '$lib/stores/alert.svelte';

class SingleUser {
	private user_controller = new UserController();

	user: User | null = $state(null);
	loading: boolean = $state(false);

	async load_user(user_id: string) {
		if (!user_id) return;

		this.loading = true;
		try {
			this.user = await this.user_controller.by_id(user_id);
		} catch {
			AlertStore.add('Failed to load user data', 'error');
		} finally {
			this.loading = false;
		}
	}

	async update_user(user_id: string, username: string): Promise<User | null> {
		if (!user_id) return null;

		this.loading = true;
		try {
			const updated = await this.user_controller.update(user_id, username);
			this.user = updated;
			AlertStore.add('User data updated successfully', 'success');
			return updated;
		} catch {
			AlertStore.add('Failed to update user data', 'error');
			return null;
		} finally {
			this.loading = false;
		}
	}

	async update_password(user_id: string, new_password: string): Promise<boolean> {
		if (!user_id) return false;

		this.loading = true;
		try {
			await this.user_controller.update_password(user_id, new_password);
			AlertStore.add('Password updated successfully', 'success');
			return true;
		} catch {
			AlertStore.add('Failed to update password', 'error');
			return false;
		} finally {
			this.loading = false;
		}
	}
}

export const UserStore = new SingleUser();
