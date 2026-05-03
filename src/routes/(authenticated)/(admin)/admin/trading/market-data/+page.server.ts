import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { TradingController } from '$lib/controllers/trading';

async function require_admin(locals: App.Locals) {
	const user = await locals.get_user();
	if (user?.role !== 'admin') error(403, 'Forbidden');
}

export const load: PageServerLoad = async ({ url, locals }) => {
	await require_admin(locals);
	const trading_controller = new TradingController();

	const symbol = url.searchParams.get('symbol') || 'SPY';

	try {
		const bars = await trading_controller.get_historical_bars(symbol);
		return { bars, symbol };
	} catch {
		return { bars: [], symbol, error: 'Failed to fetch market data.' };
	}
};
