import type { Cookies } from '@sveltejs/kit';

declare const brand: unique symbol;

export type SessionToken = string & { readonly [brand]: 'SessionToken' };

const NAME = 'TOKEN';

export const sessionCookie = {
	read: (cookies: Cookies): SessionToken | undefined => {
		const value = cookies.get(NAME);
		return value ? (value as SessionToken) : undefined;
	},
	issue: (cookies: Cookies, token: SessionToken, expiresAt: Date): void => {
		cookies.set(NAME, token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			expires: expiresAt
		});
	},
	clear: (cookies: Cookies): void => {
		cookies.delete(NAME, { path: '/' });
	},
	forwardHeader: (token: SessionToken): { Cookie: string } => ({
		Cookie: `${NAME}=${token}`
	})
};
