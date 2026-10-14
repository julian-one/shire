import type { Handle } from '@sveltejs/kit/hooks';

export const handle: Handle = ({ event, resolve }) => {
	const theme = event.cookies.get('theme');

	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('%theme%', theme === 'light' || theme === 'dark' ? theme : '')
	});
};
