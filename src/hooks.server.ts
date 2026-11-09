import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { isAxiosError } from 'axios';
import UserController from '#lib/controllers/user.js';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');
	if (session) {
		const users = new UserController();
		try {
			event.locals.user = await users.me(session);
		} catch (error) {
			const status = isAxiosError(error) ? error.response?.status : undefined;
			if (status !== 401) {
				throw error;
			}
			event.cookies.delete('session', { path: '/' });
		}
	}

	const routeId = event.route.id ?? '';
	const isProtected = routeId.startsWith('/(authenticated)');
	if (isProtected && !event.locals.user) {
		redirect(303, '/login');
	}

	const isGuestOnly = routeId.startsWith('/(unauthenticated)');
	if (isGuestOnly && event.locals.user) {
		redirect(303, '/home');
	}

	return resolve(event);
};
