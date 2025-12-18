declare global {
	namespace App {
		interface Locals {
			session: import('$lib/types/session').Session | null;
		}
	}
}

export {};
