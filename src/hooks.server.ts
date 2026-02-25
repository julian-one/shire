import { type Handle, redirect } from '@sveltejs/kit';
import { CitadelContext } from '$lib/controllers/citadel.server';
import { AuthController } from '$lib/controllers/auth';
import { UserController } from '$lib/controllers/user';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('TOKEN');
	const theme = event.cookies.get('theme') || 'dark';

	event.locals.theme = theme;

	return CitadelContext.run(token, async () => {
		if (token) {
			const auth = new AuthController();
			const user_controller = new UserController();
			try {
				const session = await auth.GetSession(token);
				if (session) {
					event.locals.session = session;
					const user = await user_controller.ById(session.user_id);
					event.locals.user = user;
				}
			} catch {
				event.cookies.delete('TOKEN', { path: '/' });
				event.locals.session = null;
				event.locals.user = null;
			}
		}

		// authentication check: redirect unauthenticated users unless the route is public.
		// this prevents route enumeration by returning the same redirect for both
		// non-existent routes and authenticated routes when not logged in.
		const isPublicRoute =
			event.route.id?.includes('(unauthenticated)') ||
			event.route.id?.includes('(public)') ||
			event.url.pathname === '/';
		if (!event.locals.session && !isPublicRoute) {
			redirect(302, '/login');
		}

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%theme%', theme)
		});
	});
};
