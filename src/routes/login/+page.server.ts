import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { login, AuthError } from '$lib/server/api';
import { setAuthCookies } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/profile');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = form.get('email')?.toString();
		const password = form.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		try {
			const data = await login(email, password);
			setAuthCookies(cookies, data.access_token, data.refresh_token);
		} catch (e) {
			if (e instanceof AuthError) {
				return fail(e.status, { error: e.message, email });
			}
			return fail(500, { error: 'An unexpected error occurred', email });
		}

		throw redirect(302, '/profile');
	}
};
