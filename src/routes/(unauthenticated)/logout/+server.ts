import { redirect, type RequestHandler, type Cookies } from '@sveltejs/kit';
import { AuthController } from '$lib/controllers/auth';

const logout = async (cookies: Cookies) => {
	const auth = new AuthController();
	try {
		await auth.Logout();
	} catch {
		// nothing to do, just delete the cookie
	}
	cookies.delete('TOKEN', { path: '/' });
};

export const POST: RequestHandler = async ({ cookies }) => {
	await logout(cookies);
	redirect(303, '/');
};

export const GET: RequestHandler = async ({ cookies }) => {
	await logout(cookies);
	redirect(303, '/');
};
