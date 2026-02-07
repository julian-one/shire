import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	return {
		username: locals.identity.state === 'authenticated' ? locals.identity.user.username : null,
		admin: locals.identity.state === 'authenticated' && locals.identity.user.role === 'admin',
		degraded: locals.identity.state === 'unavailable'
	};
};
