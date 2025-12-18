export class AuthError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
		this.name = 'AuthError';
	}
}

export interface AuthResponse {
	user_id: number;
	username: string;
	email: string;
}

export interface Session {
	session_id: string;
	user_id: number;
	created_at: string;
	expires_at: string;
}

export type AuthState = Session | null;
