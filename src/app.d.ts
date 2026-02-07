import type { Identity } from '$lib/server/moria';

declare global {
	namespace App {
		interface Locals {
			identity: Identity;
		}
	}
}

export {};
