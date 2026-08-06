import { fail } from '@sveltejs/kit';

import { forgot_password, MoriaError } from '$lib/server/moria';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData();
		const email = String(form.get('email') ?? '').trim();
		if (!email) {
			return fail(400, { error: 'Email is required.' });
		}

		let message;
		try {
			({ message } = await forgot_password(event, email));
		} catch (error) {
			if (error instanceof MoriaError) {
				return fail(error.status, { error: error.message });
			}
			throw error;
		}

		return { sent: true, message };
	}
};
