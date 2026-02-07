import { json } from '@sveltejs/kit';

import { moria } from '$lib/server/moria';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
	const reachable = await moria(fetch).healthy();
	return json({
		status: reachable ? 'ok' : 'degraded',
		moria: reachable ? 'ok' : 'unreachable',
		time: new Date().toISOString()
	});
};
