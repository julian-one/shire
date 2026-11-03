import Moria from '#lib/moria.js';

class AuthController {
	async login(email: string, password: string): Promise<void> {
		await Moria.post('/login', undefined, {
			auth: { username: email, password }
		});
	}

	async logout(): Promise<void> {
		await Moria.post('/logout');
	}
}

export default AuthController;
