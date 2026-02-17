import { Citadel } from '$lib/controllers/citadel';
import type { User, ListOptions, Role } from '$lib/types/user';

export class UserController {
	async List(options?: ListOptions): Promise<User[]> {
		const response = await Citadel.get('/users', { params: options });
		return response.data as User[];
	}

	async ById(user_id: string): Promise<User> {
		const response = await Citadel.get(`/users/${user_id}`);
		return response.data as User;
	}

	async Update(user_id: string, username: string): Promise<User> {
		const response = await Citadel.patch(`/users/${user_id}`, { username });
		return response.data as User;
	}

	async UpdateRole(user_id: string, role: Role): Promise<User> {
		const response = await Citadel.patch(`/users/${user_id}/role`, { role });
		return response.data as User;
	}
}
