import type { PageServerLoad } from './$types';
import type { LogResponse } from '$lib/types/log';
import { LogController } from '$lib/controllers/log';

export const load: PageServerLoad = async ({ url }) => {
	const log_controller = new LogController();
	const source = url.searchParams.get('source') || 'citadel';

	try {
		const logs = await log_controller.Fetch(source, 200);
		return { logs, source };
	} catch {
		const logs: LogResponse = {
			source,
			entries: [],
			count: 0,
			error: 'Failed to fetch logs'
		};
		return { logs, source };
	}
};
