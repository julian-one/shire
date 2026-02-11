export interface User {
	user_id: string;
	username: string;
	email: string;
	role: Role;
	created_at: Date;
	updated_at: Date;
}

export interface EditableFields {
	username?: string;
	role?: Role;
}

export enum Role {
	Admin = 'admin',
	User = 'user'
}

export const RoleDisplay = new Map<Role, string>([
	[Role.Admin, 'Admin'],
	[Role.User, 'User']
]);
