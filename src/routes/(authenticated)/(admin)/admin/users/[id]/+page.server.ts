import { error, fail } from '@sveltejs/kit';

import {
	delete_session,
	delete_user_sessions,
	get_user,
	list_sessions,
	MoriaError,
	update_role,
	update_username
} from '$lib/server/moria';
import type { Role } from '$lib/types/user';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// The (admin) layout guard runs concurrently — wait for it before fetching.
	await event.parent();
	try {
		const [target, sessions] = await Promise.all([
			get_user(event, event.params.id),
			list_sessions(event, event.params.id)
		]);
		return { target, sessions, current_session_id: event.locals.session?.session_id };
	} catch (err) {
		if (err instanceof MoriaError && err.status === 404) {
			error(404, 'User not found');
		}
		throw err;
	}
};

// Layout guards do not run for form actions — every action enforces admin.
function forbidden(event: { locals: App.Locals }) {
	return event.locals.user?.role !== 'admin';
}

export const actions: Actions = {
	rename: async (event) => {
		if (forbidden(event)) {
			return fail(403, { error: 'Forbidden: admin access required' });
		}
		const form = await event.request.formData();
		const username = String(form.get('username') ?? '').trim();
		if (!username) {
			return fail(400, { error: 'Username is required.' });
		}
		try {
			await update_username(event, event.params.id, username);
		} catch (err) {
			if (err instanceof MoriaError) {
				return fail(err.status, { error: err.message });
			}
			throw err;
		}
		return { message: 'Username updated.' };
	},
	set_role: async (event) => {
		if (forbidden(event)) {
			return fail(403, { error: 'Forbidden: admin access required' });
		}
		const form = await event.request.formData();
		const role_input = String(form.get('role') ?? '');
		const role: Role | undefined = role_input === 'user' || role_input === 'admin' ? role_input : undefined;
		if (!role) {
			return fail(400, { error: 'A valid role is required.' });
		}
		try {
			await update_role(event, event.params.id, role);
		} catch (err) {
			if (err instanceof MoriaError) {
				return fail(err.status, { error: err.message });
			}
			throw err;
		}
		return { message: 'Role updated.' };
	},
	revoke_session: async (event) => {
		if (forbidden(event)) {
			return fail(403, { error: 'Forbidden: admin access required' });
		}
		const form = await event.request.formData();
		const session_id = String(form.get('session_id') ?? '');
		if (!session_id) {
			return fail(400, { error: 'Session id is required.' });
		}
		try {
			await delete_session(event, session_id);
		} catch (err) {
			if (err instanceof MoriaError) {
				return fail(err.status, { error: err.message });
			}
			throw err;
		}
		return { message: 'Session revoked.' };
	},
	revoke_all_sessions: async (event) => {
		if (forbidden(event)) {
			return fail(403, { error: 'Forbidden: admin access required' });
		}
		try {
			await delete_user_sessions(event, event.params.id);
		} catch (err) {
			if (err instanceof MoriaError) {
				return fail(err.status, { error: err.message });
			}
			throw err;
		}
		return { message: 'All sessions revoked.' };
	}
};
