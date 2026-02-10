import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthController } from '$lib/controllers/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session) {
		redirect(303, '/profile');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		if (!username || !email || !password) {
			return fail(400, {
				email,
				message: 'Missing username, email or password'
			});
		}

		const auth = new AuthController();
		try {
			const session = await auth.Register(username, email, password);
			cookies.set('TOKEN', session.session_id, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				expires: new Date(session.expires_at)
			});
		} catch {
			return fail(400, {
				email,
				message: 'Registration failed. Please try again.'
			});
		}

		redirect(303, '/');
	}
};
