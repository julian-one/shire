import { fail, redirect } from '@sveltejs/kit';

import { create_user, MoriaError } from '$lib/server/moria';
import type { Role } from '$lib/types/user';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		// Layout guards do not run for form actions — enforce admin here too.
		if (event.locals.user?.role !== 'admin') {
			return fail(403, {
				error: 'Forbidden: admin access required',
				username: '',
				email: '',
				role: 'user' as Role
			});
		}

		const form = await event.request.formData();
		const username = String(form.get('username') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');
		const role_input = String(form.get('role') ?? 'user');
		const role: Role | undefined = role_input === 'user' || role_input === 'admin' ? role_input : undefined;
		if (!username || !email || !password || !role) {
			return fail(400, {
				error: 'Username, email, password, and a valid role are required.',
				username,
				email,
				role: role ?? 'user'
			});
		}

		let created;
		try {
			created = await create_user(event, username, email, password, role);
		} catch (err) {
			if (err instanceof MoriaError) {
				return fail(err.status, { error: err.message, username, email, role });
			}
			throw err;
		}

		redirect(303, `/admin/users/${created.user_id}`);
	}
};
