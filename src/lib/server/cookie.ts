import type { Cookies } from '@sveltejs/kit';

import type { Session } from '$lib/types/session';

// Shire owns the TOKEN cookie (moria docs/security.md). Lifetime tracks the
// server-side session; `secure` is Kit's default, dropped only on http://localhost.
export function set_session_cookie(cookies: Cookies, session: Session) {
	cookies.set('TOKEN', session.session_id, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		expires: new Date(session.expires_at)
	});
}
