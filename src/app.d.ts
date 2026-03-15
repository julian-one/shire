declare global {
	namespace App {
		interface Locals {
			getSession: () => Promise<import('$lib/types/session').Session | undefined>;
			getUser: () => Promise<import('$lib/types/user').User | undefined>;
			theme: string;
		}
	}
}

export {};
