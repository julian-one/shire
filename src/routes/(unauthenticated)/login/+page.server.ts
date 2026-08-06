import { fail, redirect } from '@sveltejs/kit';

import { set_session_cookie } from '$lib/server/cookie';
import { login, MoriaError } from '$lib/server/moria';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.session) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData();
		const identifier = String(form.get('identifier') ?? '').trim();
		const password = String(form.get('password') ?? '');
		if (!identifier || !password) {
			return fail(400, { error: 'Username or email and password are required.', identifier });
		}

		let session;
		try {
			session = await login(event, identifier, password);
		} catch (error) {
			if (error instanceof MoriaError) {
				return fail(error.status, { error: error.message, identifier });
			}
			throw error;
		}

		set_session_cookie(event.cookies, session);
		redirect(303, '/');
	}
};
