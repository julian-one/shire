export const ROLES = ['admin', 'user'] as const;

export type Role = (typeof ROLES)[number];

export type User = {
	user_id: string;
	username: string;
	email: string;
	role: Role;
	created_at: string;
	updated_at: string;
};
