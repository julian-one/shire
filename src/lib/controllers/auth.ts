import { Citadel } from '$lib/controllers/citadel';
import type { Session } from '$lib/types/session';

export class AuthController {
	async register(username: string, email: string): Promise<{ email: string; message: string }> {
		const response = await Citadel.post('/register', { username, email });
		return response.data;
	}

	async verify_registration(token: string): Promise<{ valid: boolean; token: string; username: string }> {
		const response = await Citadel.post('/register/verify', { token });
		return response.data;
	}

	async complete_registration(token: string, password: string): Promise<Session> {
		const response = await Citadel.post('/register/complete', { token, password });
		return response.data;
	}

	async login(identifier: string, password: string): Promise<Session> {
		const b64_creds = btoa(`${identifier}:${password}`);

		const response = await Citadel.post('/login', null, {
			headers: {
				Authorization: `Basic ${b64_creds}`
			}
		});
		return response.data;
	}

	async logout(): Promise<void> {
		await Citadel.post('/logout');
	}

	async get_session(id: string): Promise<Session> {
		const response = await Citadel.get(`/sessions/${id}`);
		return response.data as Session;
	}

	async list_sessions(user_id: string): Promise<Session[]> {
		const response = await Citadel.get(`/users/${user_id}/sessions`);
		return response.data ?? [];
	}

	async delete_session(id: string): Promise<void> {
		return await Citadel.delete(`/sessions/${id}`);
	}

	async delete_all_sessions(user_id: string): Promise<void> {
		return await Citadel.delete(`/users/${user_id}/sessions`);
	}
}
