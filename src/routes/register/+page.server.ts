import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const API_BASE = 'http://localhost:8080';

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

		const response = await fetch(`${API_BASE}/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, email, password })
		});

		if (!response.ok) {
			const data = await response.json().catch(() => ({}));
			return fail(response.status, { error: data.error || 'Registration failed', username, email });
		}

		const data = await response.json();

		cookies.set('access_token', data.access_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 5
		});

		cookies.set('refresh_token', data.refresh_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24
		});

		throw redirect(302, '/profile');
	}
};
