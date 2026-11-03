import Moria from '#lib/moria.js';
import type { User } from '#lib/types/user.js';

class UserController {
	async me(session?: string): Promise<User> {
		const headers = session ? { Cookie: `session=${session}` } : undefined;
		const response = await Moria.get<User>('/me', { headers });
		return response.data;
	}
}

export default UserController;
