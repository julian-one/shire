import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthController } from '$lib/controllers/auth';
import { AxiosError } from 'axios';

export const load: PageServerLoad = async ({ locals }) => {
	if (await locals.get_session()) {
		redirect(303, '/profile');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;

		if (!email) {
			return fail(400, { message: 'Missing email' });
		}

		const auth = new AuthController();
		try {
			await auth.forgot_password(email);
		} catch (err) {
			if (err instanceof AxiosError && err.response?.data?.error) {
				return fail(err.response.status, { message: err.response.data.error });
			}
			return fail(400, { message: 'Failed to process request. Please try again.' });
		}

		return { success: true };
	}
};
