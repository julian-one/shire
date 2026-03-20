import { Citadel } from '$lib/controllers/citadel';
import type { User, ListOptions, Role } from '$lib/types/user';

export class UserController {
	async list(options?: ListOptions): Promise<User[]> {
		const response = await Citadel.get('/users', { params: options });
		return (response.data as User[]) ?? [];
	}

	async by_id(user_id: string): Promise<User> {
		const response = await Citadel.get(`/users/${user_id}`);
		return response.data as User;
	}

	async update(user_id: string, username: string): Promise<User> {
		const response = await Citadel.patch(`/users/${user_id}`, { username });
		return response.data as User;
	}

	async update_role(user_id: string, role: Role): Promise<User> {
		const response = await Citadel.patch(`/users/${user_id}/role`, { role });
		return response.data as User;
	}

	async update_password(user_id: string, new_password: string): Promise<void> {
		await Citadel.patch(`/users/${user_id}/password`, { new_password });
	}
}
