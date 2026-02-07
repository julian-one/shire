import type { Identity } from '$lib/types';

declare global {
	namespace App {
		interface Locals {
			identity: Identity;
		}
	}
}

export {};
