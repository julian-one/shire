import { type Handle, redirect } from '@sveltejs/kit';
import { CitadelContext } from '$lib/controllers/citadel.server';
import { AuthController } from '$lib/controllers/auth';
import { UserController } from '$lib/controllers/user';
import type { Session } from '$lib/types/session';
import type { User } from '$lib/types/user';
import { SessionStore } from '$lib/server/session';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('TOKEN');
	const theme = event.cookies.get('theme') || 'dark';

	event.locals.theme = theme;

	return CitadelContext.run(token, async () => {
		// Memoize the promise so concurrent calls to get_session/get_user
		// within the same request share a single backend lookup.
		let auth_promise: Promise<{ session: Session; user: User } | undefined> | undefined;

		function load_auth(): Promise<{ session: Session; user: User } | undefined> {
			if (auth_promise) return auth_promise;

			auth_promise = (async () => {
				if (!token) return undefined;

				// Check in-memory cache
				const cached = SessionStore.get(token);
				if (cached) return cached;

				try {
					const auth = new AuthController();
					const session = await auth.get_session(token);
					if (session) {
						const user_controller = new UserController();
						const user = await user_controller.by_id(session.user_id);
						SessionStore.set(token, session, user);
						return { session, user };
					}
					return undefined;
				} catch {
					event.cookies.delete('TOKEN', { path: '/' });
					SessionStore.evict(token);
					return undefined;
				}
			})();

			return auth_promise;
		}

		event.locals.get_session = async () => (await load_auth())?.session;
		event.locals.get_user = async () => (await load_auth())?.user;

		// Authentication check: redirect unauthenticated users unless the route is public.
		// This prevents route enumeration by returning the same redirect for both
		// non-existent routes and authenticated routes when not logged in.
		const is_public_route =
			event.route.id?.includes('(unauthenticated)') ||
			event.route.id?.includes('(public)') ||
			event.url.pathname === '/';
		if (!is_public_route) {
			const session = await event.locals.get_session();
			if (!session) {
				redirect(302, '/login');
			}
		}

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%theme%', theme)
		});
	});
};
