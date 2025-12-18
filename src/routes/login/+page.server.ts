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
		const email = form.get('email')?.toString();
		const password = form.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		const response = await fetch(`${API_BASE}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		if (!response.ok) {
			const data = await response.json().catch(() => ({}));
			return fail(401, { error: data.error || 'Invalid credentials', email });
		}

		const data = await response.json();

		// Store tokens in httpOnly cookies (secure, not accessible to JS)
		cookies.set('access_token', data.access_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false, // Set to true in production with HTTPS
			maxAge: 60 * 5 // 5 minutes
		});

		cookies.set('refresh_token', data.refresh_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 // 24 hours
		});

		throw redirect(302, '/profile');
	}
};
