import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserController } from '$lib/controllers/user';
import { AuthController } from '$lib/controllers/auth';
import { SessionStore } from '$lib/server/session';
import { Role } from '$lib/types/user';
import type { ListOptions } from '$lib/types/user';

const VALID_ROLES = Object.values(Role) as string[];

async function requireAdmin(locals: App.Locals) {
	const user = await locals.get_user();
	if (user?.role !== 'admin') error(403, 'Forbidden');
}

export const load: PageServerLoad = async ({ url, locals }) => {
	await requireAdmin(locals);
	const user_controller = new UserController();

	const search = url.searchParams.get('search') || '';
	const role = url.searchParams.get('role') || '';
	const order_by = url.searchParams.get('order_by') || 'created_at:desc';

	const options: ListOptions = {
		search,
		role,
		order_by
	};

	try {
		const users = await user_controller.list(options);
		return {
			users,
			search,
			role,
			order_by
		};
	} catch {
		return {
			users: [],
			search,
			role,
			order_by,
			error: 'Failed to load users'
		};
	}
};

export const actions: Actions = {
	list_sessions: async ({ request, locals }) => {
		await requireAdmin(locals);

		const form = await request.formData();
		const user_id = form.get('user_id') as string;
		if (!user_id) return fail(400, { message: 'Missing user_id' });

		const auth = new AuthController();
		try {
			const sessions = await auth.list_sessions(user_id);
			return { sessions, user_id };
		} catch {
			return fail(500, { message: 'Failed to load sessions' });
		}
	},

	revoke_session: async ({ request, locals }) => {
		await requireAdmin(locals);

		const form = await request.formData();
		const session_id = form.get('session_id') as string;
		if (!session_id) return fail(400, { message: 'Missing session_id' });

		const auth = new AuthController();
		try {
			await auth.delete_session(session_id);
			SessionStore.evict(session_id);
			return { revoked_session_id: session_id };
		} catch {
			return fail(500, { message: 'Failed to revoke session' });
		}
	},

	revoke_all_sessions: async ({ request, locals }) => {
		await requireAdmin(locals);

		const form = await request.formData();
		const user_id = form.get('user_id') as string;
		if (!user_id) return fail(400, { message: 'Missing user_id' });

		const auth = new AuthController();
		try {
			const sessions = await auth.list_sessions(user_id);
			await auth.delete_all_sessions(user_id);
			for (const session of sessions) {
				SessionStore.evict(session.session_id);
			}
			return { revoked_user_id: user_id };
		} catch {
			return fail(500, { message: 'Failed to revoke all sessions' });
		}
	},

	update_role: async ({ request, locals }) => {
		await requireAdmin(locals);

		const form = await request.formData();
		const user_id = form.get('user_id') as string;
		const role = form.get('role') as string;
		if (!user_id || !role) return fail(400, { message: 'Missing user_id or role' });
		if (!VALID_ROLES.includes(role)) return fail(400, { message: 'Invalid role' });

		const user_controller = new UserController();
		try {
			const user = await user_controller.update_role(user_id, role as Role);
			SessionStore.evict_by_user(user_id);
			return { user };
		} catch {
			return fail(500, { message: 'Failed to update role' });
		}
	}
};
