import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

export const API_BASE = env.CITADEL_API_URL ?? 'http://localhost:8080';
const USE_SECURE_COOKIES = env.SECURE_COOKIES !== 'false';

export const SESSION_COOKIE_NAME = 'session_id';
export const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

const COOKIE_OPTIONS = {
	path: '/',
	httpOnly: true,
	sameSite: 'strict' as const,
	secure: !dev && USE_SECURE_COOKIES
};

export function setSessionCookie(cookies: Cookies, sessionId: string): void {
	cookies.set(SESSION_COOKIE_NAME, sessionId, { ...COOKIE_OPTIONS, maxAge: SESSION_MAX_AGE });
}

export function clearSessionCookie(cookies: Cookies): void {
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

export function getSessionId(cookies: Cookies): string | undefined {
	return cookies.get(SESSION_COOKIE_NAME);
}
