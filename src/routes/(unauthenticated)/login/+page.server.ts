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
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		if (!email || !password) {
			return fail(400, {
				email,
				message: 'Missing email or password'
			});
		}

		const auth = new AuthController();
		try {
			const session = await auth.Login(email, password);
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
				message: 'Invalid credentials'
			});
		}

		redirect(303, '/');
	}
};
