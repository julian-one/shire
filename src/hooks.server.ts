import { type Handle, redirect } from '@sveltejs/kit';
import { CitadelContext } from '$lib/controllers/citadel.server';
import { AuthController } from '$lib/controllers/auth';
import { UserController } from '$lib/controllers/user';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('TOKEN');

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

		// authentication check for routes that require authentication
		if (event.route.id?.includes('(authenticated)') && !event.locals.session) {
			redirect(307, `/logout?redirect=${event.url.pathname}`);
		}

		return resolve(event);
	});
};
