import { Citadel } from '$lib/controllers/citadel';
import type { LogResponse } from '$lib/types/log';

export class LogController {
	async Fetch(source?: string, lines?: number): Promise<LogResponse> {
		const response = await Citadel.get('/logs', { params: { source, lines } });
		return response.data as LogResponse;
	}
}
