import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthController } from '$lib/controllers/auth';
import { AxiosError } from 'axios';

type ActionFailureData = { email: string; field: string; message: string };

export const load: PageServerLoad = async ({ locals }) => {
	if (await locals.getSession()) {
		redirect(303, '/profile');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const email = data.get('email') as string;

		if (!username || !email) {
			return fail<ActionFailureData>(400, {
				email,
				field: '',
				message: 'Missing username or email'
			});
		}

		const auth = new AuthController();
		try {
			await auth.Register(username, email);
		} catch (err) {
			if (err instanceof AxiosError && err.response?.data?.error) {
				const backendError: string = err.response.data.error;
				const field = backendError.toLowerCase().includes('username') ? 'username' : 'email';
				return fail<ActionFailureData>(err.response.status, {
					email,
					field,
					message: backendError
				});
			}
			return fail<ActionFailureData>(400, {
				email,
				field: '',
				message: 'Registration failed. Please try again.'
			});
		}

		redirect(303, `/verify?email=${encodeURIComponent(email)}`);
	}
};
