import type { Session } from '$lib/types/session';
import type { User } from '$lib/types/user';

class Auth {
	session = $state<Session | null>(null);
	user = $state<User | null>(null);

	init(session: Session | null, user: User | null) {
		this.session = session;
		this.user = user;
	}

	clear() {
		this.session = null;
		this.user = null;
	}
}

export const AuthStore = new Auth();
