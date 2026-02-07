export type Role = 'admin' | 'user';

export type User = {
	user_id: string;
	username: string;
	email: string;
	role: Role;
	created_at: string;
	updated_at: string;
};
