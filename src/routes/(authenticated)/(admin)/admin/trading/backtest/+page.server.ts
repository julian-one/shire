import type { PageServerLoad } from './$types';
import { TradingController } from '$lib/controllers/trading';

export const load: PageServerLoad = async () => {
	const controller = new TradingController();

	try {
		const backtests = await controller.list_backtests();
		return { backtests };
	} catch {
		return { backtests: [] };
	}
};
