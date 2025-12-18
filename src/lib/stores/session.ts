import { writable } from 'svelte/store';
import moment from 'moment';
import type { AuthState, Session } from '$lib/types/session';

const localStorageKey = 'session_storage';

let initial: AuthState = null;

if (typeof window !== 'undefined') {
	try {
		const stored = localStorage.getItem(localStorageKey);
		if (stored) {
			const parsed: AuthState = JSON.parse(stored);
			if (parsed && parsed.expires_at) {
				const expiration = moment(parsed.expires_at);
				const now = moment();

				if (expiration.isValid() && now.isBefore(expiration)) {
					initial = parsed;
				} else {
					console.log('Stored session found but expired, clearing.');
					localStorage.removeItem(localStorageKey);
				}
			} else {
				console.log('No valid session found in localStorage.');
				localStorage.removeItem(localStorageKey);
			}
		}
	} catch (error) {
		console.error('Error parsing session from localStorage:', error);
		localStorage.removeItem(localStorageKey);
	}
}

export const SessionStore = writable<AuthState>(initial);

SessionStore.subscribe((value) => {
	if (typeof window !== 'undefined') {
		if (value) {
			try {
				const expiration = moment(value.expires_at).utc().format('ddd, DD MMM YYYY HH:mm:ss [UTC]');
				document.cookie = `TOKEN=${value.session_id}; expires=${expiration}; path=/;`;
				localStorage.setItem(localStorageKey, JSON.stringify(value));
			} catch (error) {
				console.error('Error saving session to localStorage:', error);
			}
		} else {
			document.cookie = 'TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			localStorage.removeItem(localStorageKey);
		}
	}
});

export function SetSession(session: Session) {
	SessionStore.set(session);
}

export function ClearAuthData() {
	SessionStore.set(null);
}
