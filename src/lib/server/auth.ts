import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

export const API_BASE = env.CITADEL_API_URL ?? 'http://localhost:8080';

export const ACCESS_TOKEN_MAX_AGE = 60 * 5; // 5 minutes
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24; // 24 hours

const COOKIE_OPTIONS = {
	path: '/',
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: !dev
};

export function setAuthCookies(cookies: Cookies, accessToken: string, refreshToken: string): void {
	cookies.set('access_token', accessToken, { ...COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE });
	cookies.set('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: REFRESH_TOKEN_MAX_AGE });
}

export function clearAuthCookies(cookies: Cookies): void {
	cookies.delete('access_token', { path: '/' });
	cookies.delete('refresh_token', { path: '/' });
}

export function getAccessToken(cookies: Cookies): string | undefined {
	return cookies.get('access_token');
}

export function getRefreshToken(cookies: Cookies): string | undefined {
	return cookies.get('refresh_token');
}
