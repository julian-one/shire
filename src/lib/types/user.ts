export type Role = 'user' | 'admin';

export interface User {
	user_id: string;
	username: string;
	email: string;
	role: Role;
	created_at: string;
	updated_at: string;
}
