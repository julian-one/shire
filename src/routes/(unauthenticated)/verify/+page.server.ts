import { fail, redirect } from '@sveltejs/kit';

import { set_session_cookie } from '$lib/server/cookie';
import { complete_registration, MoriaError, verify_registration } from '$lib/server/moria';

import type { Actions, PageServerLoad } from './$types';

// Hard route obligation: moria's verification emails link to /verify?code=...

export const load: PageServerLoad = async (event) => {
	const code = event.url.searchParams.get('code');
	if (!code) {
		return { valid: false as const, error: 'The verification link is missing its code.' };
	}

	try {
		const result = await verify_registration(event, code);
		return { valid: true as const, username: result.username };
	} catch (error) {
		if (error instanceof MoriaError) {
			return { valid: false as const, error: error.message };
		}
		throw error;
	}
};

export const actions: Actions = {
	default: async (event) => {
		const code = event.url.searchParams.get('code');
		if (!code) {
			return fail(400, { error: 'The verification link is missing its code.' });
		}

		const form = await event.request.formData();
		const password = String(form.get('password') ?? '');
		const confirm = String(form.get('confirm') ?? '');
		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters.' });
		}
		if (password !== confirm) {
			return fail(400, { error: 'Passwords do not match.' });
		}

		let session;
		try {
			session = await complete_registration(event, code, password);
		} catch (error) {
			if (error instanceof MoriaError) {
				return fail(error.status, { error: error.message });
			}
			throw error;
		}

		set_session_cookie(event.cookies, session);
		redirect(303, '/');
	}
};
