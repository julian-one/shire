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
		const token = data.get('token') as string;
		const password = data.get('password') as string;
		const confirm_password = data.get('confirm_password') as string;

		if (!token) {
			return fail(400, { message: 'Missing reset token.' });
		}
		if (!password || !confirm_password) {
			return fail(400, { message: 'Please enter and confirm your new password.' });
		}
		if (password !== confirm_password) {
			return fail(400, { message: 'Passwords do not match.' });
		}
		if (password.length < 8) {
			return fail(400, { message: 'Password must be at least 8 characters long.' });
		}

		const auth = new AuthController();
		try {
			await auth.reset_password(token, password);
		} catch (err) {
			if (err instanceof AxiosError && err.response?.data?.error) {
				return fail(err.response.status, { message: err.response.data.error });
			}
			return fail(400, { message: 'Failed to reset password. The link may have expired.' });
		}

		redirect(303, '/login');
	}
};
