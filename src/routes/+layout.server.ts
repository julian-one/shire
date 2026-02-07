import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	return {
		loggedIn: locals.identity.state === 'authenticated',
		degraded: locals.identity.state === 'unavailable'
	};
};
