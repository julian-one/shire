import type { Session } from '$lib/types/session';
import type { User } from '$lib/types/user';

declare global {
	namespace App {
		interface Locals {
			session?: Session;
			user?: User;
		}
	}
}

export {};
