import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { TradingController } from '$lib/controllers/trading';

async function require_admin(locals: App.Locals) {
	const user = await locals.get_user();
	if (user?.role !== 'admin') error(403, 'Forbidden');
}

export const load: PageServerLoad = async ({ locals }) => {
	await require_admin(locals);
	const trading_controller = new TradingController();

	try {
		const account = await trading_controller.get_account();
		return { account };
	} catch {
		return { account: null, error: 'Failed to connect to the broker.' };
	}
};
