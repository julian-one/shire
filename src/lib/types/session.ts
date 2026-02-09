export interface Session {
	session_id: string;
	user_id: string;
	created_at: string;
	expires_at: string;
}

export type AuthState = Session | null;
