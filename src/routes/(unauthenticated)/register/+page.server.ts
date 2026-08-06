import { fail, redirect } from '@sveltejs/kit';

import { MoriaError, register } from '$lib/server/moria';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.session) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData();
		const username = String(form.get('username') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		if (!username || !email) {
			return fail(400, { error: 'Username and email are required.', username, email });
		}

		try {
			await register(event, username, email);
		} catch (error) {
			if (error instanceof MoriaError) {
				return fail(error.status, { error: error.message, username, email });
			}
			throw error;
		}

		return { sent: true, email };
	}
};
