import { Citadel } from '$lib/controllers/citadel';
import type { User } from '$lib/types/user';

export class UserController {
	public async GetUser(user_id: number): Promise<User> {
		const response = await Citadel.get(`/user/${user_id}`);
		return response.data as User;
	}
}
