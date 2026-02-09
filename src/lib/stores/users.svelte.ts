import type { User } from '$lib/types/user';

class UserList {
	users: Partial<User>[] = $state([]);

	public add(user: Partial<User>) {
		this.users = [...this.users, user];
	}

	public remove(user_id: string) {
		this.users = this.users.filter((user) => user.user_id !== user_id);
	}

	public update(user: Partial<User>) {
		this.users = this.users.map((u) => (u.user_id === user.user_id ? { ...u, ...user } : u));
	}

	public clear() {
		this.users = [];
	}

	public get(user_id: string): Partial<User> | null {
		return this.users.find((user) => user.user_id === user_id) || null;
	}
}

export const UserListStore = new UserList();
