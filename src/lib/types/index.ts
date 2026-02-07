import { type User } from './user';

export * from './cluster';
export * from './user';

declare const brand: unique symbol;

export type SessionToken = string & { readonly [brand]: 'SessionToken' };

export type Identity = { state: 'authenticated'; user: User } | { state: 'anonymous' } | { state: 'unavailable' };

export type LoginResult =
	| { state: 'authenticated'; token: SessionToken; expiresAt: Date }
	| { state: 'invalid' }
	| { state: 'unavailable' };
