import { type Handle, redirect } from '@sveltejs/kit';
import { CitadelContext } from '$lib/controllers/citadel.server';
import { AuthController } from '$lib/controllers/auth';
import { UserController } from '$lib/controllers/user';
import type { Session } from '$lib/types/session';
import type { User } from '$lib/types/user';
import sessionCache from '$lib/server/session-cache';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('TOKEN');
	const theme = event.cookies.get('theme') || 'dark';

	event.locals.theme = theme;

	return CitadelContext.run(token, async () => {
		// Memoize the promise so concurrent calls to getSession/getUser
		// within the same request share a single backend lookup.
		let authPromise: Promise<{ session: Session; user: User } | undefined> | undefined;

		function loadAuth(): Promise<{ session: Session; user: User } | undefined> {
			if (authPromise) return authPromise;

			authPromise = (async () => {
				if (!token) return undefined;

				// Check in-memory cache
				const cached = sessionCache.get(token);
				if (cached) return cached;

				try {
					const auth = new AuthController();
					const session = await auth.GetSession(token);
					if (session) {
						const user_controller = new UserController();
						const user = await user_controller.ById(session.user_id);
						sessionCache.set(token, session, user);
						return { session, user };
					}
					return undefined;
				} catch {
					event.cookies.delete('TOKEN', { path: '/' });
					sessionCache.evict(token);
					return undefined;
				}
			})();

			return authPromise;
		}

		event.locals.getSession = async () => (await loadAuth())?.session;
		event.locals.getUser = async () => (await loadAuth())?.user;

		// Authentication check: redirect unauthenticated users unless the route is public.
		// This prevents route enumeration by returning the same redirect for both
		// non-existent routes and authenticated routes when not logged in.
		const isPublicRoute =
			event.route.id?.includes('(unauthenticated)') ||
			event.route.id?.includes('(public)') ||
			event.url.pathname === '/';
		if (!isPublicRoute) {
			const session = await event.locals.getSession();
			if (!session) {
				redirect(302, '/login');
			}
		}

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%theme%', theme)
		});
	});
};
