import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthController } from '$lib/controllers/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (await locals.get_session()) {
		redirect(303, '/profile');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const identifier = data.get('identifier') as string;
		const password = data.get('password') as string;

		if (!identifier || !password) {
			return fail(400, {
				identifier,
				message: 'Missing email/username or password'
			});
		}

		const auth = new AuthController();
		try {
			const session = await auth.login(identifier, password);
			cookies.set('TOKEN', session.session_id, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				expires: new Date(session.expires_at)
			});
		} catch {
			return fail(400, {
				identifier,
				message: 'Invalid credentials'
			});
		}

		redirect(303, '/');
	}
};
