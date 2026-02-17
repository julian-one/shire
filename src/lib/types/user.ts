export type User = {
	user_id: string;
	username: string;
	email: string;
	role: Role;
	created_at: Date;
	updated_at: Date;
};

export enum Role {
	Admin = 'admin',
	User = 'user'
}

export const RoleDisplay = new Map<Role, string>([
	[Role.Admin, 'Admin'],
	[Role.User, 'User']
]);

export type ListOptions = {
	search?: string;
	role?: string;
	order_by?: string;
};
