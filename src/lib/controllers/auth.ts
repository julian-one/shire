import { Citadel } from '$lib/controllers/citadel';
import type { Session } from '$lib/types/session';

export class AuthController {
	public async Login(email: string, password: string): Promise<Session> {
		console.log('Logging in with email:', email);
		const credentials = `${email}:${password}`;
		const base64Credentials = btoa(credentials);
		console.log('Base64 Encoded Credentials for Login:', base64Credentials);

		const response = await Citadel.post('/login', null, {
			headers: {
				Authorization: `Basic ${base64Credentials}`
			}
		});
		return response.data;
	}

	public async Register(username: string, email: string, password: string): Promise<Session> {
		console.log('Registering with username:', username, 'email:', email);
		const credentials = `${email}:${password}`;
		const base64Credentials = btoa(credentials);
		console.log('Base64 Encoded Credentials for Registration:', base64Credentials);

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
