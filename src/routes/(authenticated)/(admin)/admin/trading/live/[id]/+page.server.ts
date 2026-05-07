import { error } from '@sveltejs/kit';
import { TradingController } from '$lib/controllers/trading';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const trading_controller = new TradingController();
	try {
		const details = await trading_controller.get_live_session_details(params.id);
		return {
			details
		};
	} catch {
		error(404, 'Trading session not found');
	}
};
