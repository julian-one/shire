import { fail } from '@sveltejs/kit';

import { MoriaError, reset_password } from '$lib/server/moria';

import type { Actions, PageServerLoad } from './$types';

// Hard route obligation: moria's reset emails link to /reset-password?token=...

export const load: PageServerLoad = ({ url }) => {
	return { has_token: url.searchParams.has('token') };
};

export const actions: Actions = {
	default: async (event) => {
		const token = event.url.searchParams.get('token');
		if (!token) {
			return fail(400, { error: 'The reset link is missing its token.' });
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

		try {
			await reset_password(event, token, password);
		} catch (error) {
			if (error instanceof MoriaError) {
				return fail(error.status, { error: error.message });
			}
			throw error;
		}

		return { success: true };
	}
};
