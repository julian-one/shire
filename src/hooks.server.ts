import { isHttpError, isRedirect, redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { log } from '$lib/server/log';
import { get_session, get_user, MoriaError } from '$lib/server/moria';

// Matches the slog JSON lines moria and rivendell emit — same msg, same keys,
// duration in integer nanoseconds — so one grep works across all three pods.
const logger: Handle = async ({ event, resolve }) => {
	const start = performance.now();
	let status = 500;
	try {
		const response = await resolve(event);
		status = response.status;
		return response;
	} catch (error) {
		if (isRedirect(error) || isHttpError(error)) {
			status = error.status;
		}
		throw error;
	} finally {
		let remote_addr = '';
		try {
			remote_addr = event.getClientAddress();
		} catch {
			// adapter-node throws when X-Forwarded-For is absent (direct curls)
		}
		log('INFO', 'http request completed', {
			method: event.request.method,
			path: event.url.pathname,
			remote_addr,
			status,
			duration: Math.round((performance.now() - start) * 1e6)
		});
	}
};

const authentication: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('TOKEN');
	if (token) {
		try {
			const session = await get_session(event, token);
			event.locals.session = session;
			event.locals.user = await get_user(event, session.user_id);
		} catch (error) {
			event.locals.session = undefined;
			event.locals.user = undefined;
			// Only an invalid or expired session burns the cookie; moria being
			// unreachable must not log the user out.
			if (error instanceof MoriaError && (error.status === 401 || error.status === 404)) {
				event.cookies.delete('TOKEN', { path: '/' });
			}
		}
	}

	// Default-deny: only (unauthenticated) routes and the landing page are
	// public. Unknown routes get the same redirect, so nothing is enumerable.
	const is_public = event.route.id?.includes('(unauthenticated)') === true || event.url.pathname === '/';
	if (!is_public && !event.locals.session) {
		redirect(302, '/login');
	}

	return resolve(event);
};

export const handle = sequence(logger, authentication);

export const handleError: HandleServerError = ({ error, event, status, message }) => {
	log('ERROR', 'unhandled error', {
		method: event.request.method,
		path: event.url.pathname,
		status,
		error: error instanceof Error ? error.message : String(error),
		stack: error instanceof Error ? error.stack : undefined
	});
	return { message };
};
