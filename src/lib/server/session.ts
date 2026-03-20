import type { Session } from '$lib/types/session';
import type { User } from '$lib/types/user';

const SESSION_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CLEANUP_INTERVAL_MS = 60 * 1000; // 1 minute

type CacheEntry = {
	session: Session;
	user: User;
	expires: number;
};

class SessionCache {
	private cache = new Map<string, CacheEntry>();
	private timer: NodeJS.Timeout;

	constructor() {
		// Periodically purge expired entries to prevent memory leaks.
		// unref() allows the Node.js process to exit gracefully even if this timer is still scheduled.
		this.timer = setInterval(() => {
			const now = Date.now();
			for (const [token, entry] of this.cache) {
				if (entry.expires <= now) {
					this.cache.delete(token);
				}
			}
		}, CLEANUP_INTERVAL_MS);
		this.timer.unref();
	}

	get(token: string): { session: Session; user: User } | null {
		const entry = this.cache.get(token);
		if (entry && entry.expires > Date.now()) {
			return { session: entry.session, user: entry.user };
		}
		if (entry) {
			this.cache.delete(token);
		}
		return null;
	}

	set(token: string, session: Session, user: User): void {
		this.cache.set(token, { session, user, expires: Date.now() + SESSION_TTL_MS });
	}

	evict(token: string): void {
		this.cache.delete(token);
	}

	evict_by_user(user_id: string): void {
		for (const [token, entry] of this.cache) {
			if (entry.session.user_id === user_id) {
				this.cache.delete(token);
			}
		}
	}
}

export const SessionStore = new SessionCache();
