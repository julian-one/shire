import type { User } from '#lib/types/user.js';

declare global {
	namespace App {
		interface Locals {
			user?: User;
		}
		interface PageData {
			user?: User;
		}
	}
}

export {};
