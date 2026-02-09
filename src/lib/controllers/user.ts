import { Citadel } from '$lib/controllers/citadel';
import type { User } from '$lib/types/user';

export class UserController {
	public async List(): Promise<User[]> {
		const response = await Citadel.get('/user');
		return response.data as User[];
	}

	public async ById(user_id: string): Promise<User> {
		const response = await Citadel.get(`/user/${user_id}`);
		return response.data as User;
	}
}
