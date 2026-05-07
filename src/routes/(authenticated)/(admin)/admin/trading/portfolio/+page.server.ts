import type { PageServerLoad } from './$types';
import { TradingController } from '$lib/controllers/trading';

export const load: PageServerLoad = async ({ url }) => {
	const controller = new TradingController();

	try {
		const timeframe = url.searchParams.get('timeframe') || '1D';
		const period = url.searchParams.get('period') || '1M';

		const [positions, history] = await Promise.all([
			controller.get_positions(),
			controller.get_portfolio_history(period, timeframe)
		]);

		return {
			positions,
			history
		};
	} catch (err) {
		const e = err as { response?: { data?: { error?: string } }; message?: string };
		return {
			positions: [],
			history: null,
			error: e.response?.data?.error || e.message || 'Failed to load portfolio data'
		};
	}
};
