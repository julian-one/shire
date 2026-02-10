import { Citadel } from '$lib/controllers/citadel';
import type { Session } from '$lib/types/session';

export class AuthController {
	public async Login(email: string, password: string): Promise<Session> {
		const credentials = `${email}:${password}`;
		const base64Credentials = btoa(credentials);

		const response = await Citadel.post('/login', null, {
			headers: {
				Authorization: `Basic ${base64Credentials}`
			}
		});
		return response.data;
	}

	public async Register(username: string, email: string, password: string): Promise<Session> {
		const credentials = `${email}:${password}`;
		const base64Credentials = btoa(credentials);

		const response = await Citadel.post(
			'/register',
			{ username },
			{
				headers: {
					Authorization: `Basic ${base64Credentials}`
				}
			}
		);
		return response.data;
	}

	public async Logout(): Promise<void> {
		await Citadel.post('/logout');
	}

	public async GetSession(id: string): Promise<Session> {
		const response = await Citadel.get(`/session/${id}`);
		return response.data as Session;
	}
}
