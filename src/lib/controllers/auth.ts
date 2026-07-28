import { Moria } from '$lib/controllers/moria';
import type { Session } from '$lib/types/session';
import type { PaginatedResponse } from '$lib/types/database';

export class AuthController {
	async register(username: string, email: string): Promise<{ email: string; message: string }> {
		const response = await Moria.post('/register', { username, email });
		return response.data;
	}

	async verify_registration(token: string): Promise<{ valid: boolean; token: string; username: string }> {
		const response = await Moria.post('/register/verify', { token });
		return response.data;
	}

	async complete_registration(token: string, password: string): Promise<Session> {
		const response = await Moria.post('/register/complete', { token, password });
		return response.data;
	}

	async login(identifier: string, password: string): Promise<Session> {
		const b64_creds = btoa(`${identifier}:${password}`);

		const response = await Moria.post('/login', null, {
			headers: {
				Authorization: `Basic ${b64_creds}`
			}
		});
		return response.data;
	}

	async logout(): Promise<void> {
		await Moria.post('/logout');
	}

	async forgot_password(email: string): Promise<{ message: string }> {
		const response = await Moria.post('/forgot-password', { email });
		return response.data;
	}

	async reset_password(token: string, password: string): Promise<{ message: string }> {
		const response = await Moria.post('/reset-password', { token, password });
		return response.data;
	}

	async get_session(id: string): Promise<Session> {
		const response = await Moria.get(`/sessions/${id}`);
		return response.data as Session;
	}

	async list_sessions(user_id: string): Promise<PaginatedResponse<Session>> {
		const response = await Moria.get(`/users/${user_id}/sessions`);
		return response.data as PaginatedResponse<Session>;
	}

	async delete_session(id: string): Promise<void> {
		return await Moria.delete(`/sessions/${id}`);
	}

	async delete_all_sessions(user_id: string): Promise<void> {
		return await Moria.delete(`/users/${user_id}/sessions`);
	}
}
