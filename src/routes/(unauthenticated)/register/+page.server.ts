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
		const username = data.get('username') as string;
		const email = data.get('email') as string;

		if (!username || !email) {
			return fail(400, { message: 'Missing username or email' });
		}

		const auth = new AuthController();
		try {
			await auth.register(username, email);
		} catch (err) {
			if (err instanceof AxiosError && err.response?.data?.error) {
				return fail(err.response.status, { message: err.response.data.error });
			}
			return fail(400, { message: 'Registration failed. Please try again.' });
		}

		redirect(303, `/verify?email=${encodeURIComponent(email)}`);
	}
};
