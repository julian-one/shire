import { Citadel } from '$lib/controllers/citadel';
import type { EditableFields, User } from '$lib/types/user';

export class UserController {
	async List(): Promise<User[]> {
		const response = await Citadel.get('/user');
		return response.data as User[];
	}

	async ById(user_id: string): Promise<User> {
		const response = await Citadel.get(`/user/${user_id}`);
		return response.data as User;
	}

	async Update(user_id: string, edits: EditableFields): Promise<User> {
		const response = await Citadel.patch(`/user/${user_id}`, { ...edits });
		return response.data as User;
	}
}
