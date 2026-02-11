declare global {
	namespace App {
		interface Locals {
			session: import('$lib/types/session').Session | null;
			user: import('$lib/types/user').User | null;
			theme: string;
		}
	}
}

export {};
