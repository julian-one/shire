declare global {
	namespace App {
		interface Locals {
			get_session: () => Promise<import('$lib/types/session').Session | undefined>;
			get_user: () => Promise<import('$lib/types/user').User | undefined>;
			theme: string;
		}
	}
}

export {};
