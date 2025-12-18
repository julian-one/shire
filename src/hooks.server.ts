import { type Handle, redirect } from '@sveltejs/kit';
import { AuthController } from '$lib/controllers/auth';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.route.id?.includes('(authenticated)')) {
		console.log('Route requires authentication');
		const token = event.cookies.get('TOKEN');
		console.log(`Token from cookies: ${token}`);
		if (!token) {
			console.log('No token found, redirecting to logout');
			redirect(307, `/logout?redirect=${event.url.pathname}`);
		}

		const auth = new AuthController();
		try {
			console.log('Validating token and fetching session');
			event.locals.session = await auth.GetSession(token);
		} catch {
			console.log('Invalid token, deleting cookie and redirecting to logout');
			event.cookies.delete('TOKEN', { path: '/' });
			redirect(307, `/logout?redirect=${event.url.pathname}`);
		}

		console.log(`Session obtained: ${JSON.stringify(event.locals.session)}`);
		if (!event.locals.session) {
			console.log('No session found, deleting token and redirecting to logout');
			event.cookies.delete('TOKEN', { path: '/' });
			redirect(307, `/logout?redirect=${event.url.pathname}`);
		}
	}
	console.log('No authentication required, proceeding with request');
	return resolve(event);
};
