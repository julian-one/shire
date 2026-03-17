import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthController } from '$lib/controllers/auth';
import sessionCache from '$lib/server/session-cache';

export const load: PageServerLoad = async ({ url, locals }) => {
	const code = url.searchParams.get('code') ?? '';
	const email = url.searchParams.get('email') ?? '';

	if (await locals.getSession()) {
		redirect(303, '/');
	}

	if (!code && !email) {
		redirect(303, '/register');
	}

	return { code, email };
};

export const actions: Actions = {
	verify: async ({ request }) => {
		const data = await request.formData();
		const code = data.get('code') as string;

		if (!code) {
			return fail(400, { message: 'Missing verification code' });
		}

		const auth = new AuthController();
		try {
			const result = await auth.VerifyRegistration(code);
			return { verified: true, token: result.token, username: result.username };
		} catch {
			return fail(400, { message: 'Invalid or expired verification code' });
		}
	},

	setPassword: async ({ request, cookies }) => {
		const data = await request.formData();
		const token = data.get('token') as string;
		const password = data.get('password') as string;

		if (!token || !password) {
			return fail(400, { message: 'Missing token or password' });
		}

		const auth = new AuthController();
		try {
			const oldToken = cookies.get('TOKEN');
			if (oldToken) {
				sessionCache.evict(oldToken);
			}

			const session = await auth.CompleteRegistration(token, password);
			cookies.set('TOKEN', session.session_id, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				expires: new Date(session.expires_at)
			});

			return { created: true };
		} catch {
			return fail(400, { message: 'Failed to create account. The link may have expired.' });
		}
	}
};
