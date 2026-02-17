import { Citadel } from '$lib/controllers/citadel';
import type { Session } from '$lib/types/session';

export class AuthController {
	async Login(email: string, password: string): Promise<Session> {
		const credentials = `${email}:${password}`;
		const base64Credentials = btoa(credentials);

		const response = await Citadel.post('/login', null, {
			headers: {
				Authorization: `Basic ${base64Credentials}`
			}
		});
		return response.data;
	}

	async Register(username: string, email: string, password: string): Promise<Session> {
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

	async Logout(): Promise<void> {
		await Citadel.post('/logout');
	}

	async GetSession(id: string): Promise<Session> {
		const response = await Citadel.get(`/sessions/${id}`);
		return response.data as Session;
	}

	async ListSessions(user_id: string): Promise<Session[]> {
		const response = await Citadel.get(`/users/${user_id}/sessions`);
		return response.data ?? [];
	}

	async DeleteSession(id: string): Promise<void> {
		return await Citadel.delete(`/sessions/${id}`);
	}

	async DeleteAllSessions(user_id: string): Promise<void> {
		return await Citadel.delete(`/users/${user_id}/sessions`);
	}
}
