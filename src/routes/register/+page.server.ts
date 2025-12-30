import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { register, AuthError } from '$lib/server/api';
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
		const username = form.get('username')?.toString();
		const email = form.get('email')?.toString();
		const password = form.get('password')?.toString();

		if (!username || !email || !password) {
			return fail(400, { error: 'All fields are required', username, email });
		}

		try {
			const data = await register(username, email, password);
			setAuthCookies(cookies, data.access_token, data.refresh_token);
		} catch (e) {
			if (e instanceof AuthError) {
				return fail(e.status, { error: e.message, username, email });
			}
			return fail(500, { error: 'An unexpected error occurred', username, email });
		}

		throw redirect(302, '/profile');
	}
};
