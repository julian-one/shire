import { Citadel } from '$lib/controllers/citadel';
import type { TradingAccount, StockBar, Asset, BacktestResponse } from '$lib/types/trading';

export class TradingController {
	async get_account(): Promise<TradingAccount> {
		const response = await Citadel.get('/trading/account');
		return response.data as TradingAccount;
	}

	async get_historical_bars(symbol: string, start?: string, end?: string): Promise<StockBar[]> {
		const params = new URLSearchParams();
		params.set('symbol', symbol);
		if (start) params.set('start', start);
		if (end) params.set('end', end);

		const response = await Citadel.get(`/trading/stocks/bars?${params.toString()}`);
		// The API returns an array of bars directly or under a key depending on the Alpaca struct,
		// but our route json encodes the slice `[]marketdata.Bar` directly
		return response.data as StockBar[];
	}

	async search_assets(query: string): Promise<Asset[]> {
		const response = await Citadel.get(`/trading/assets/search?q=${encodeURIComponent(query)}`);
		return response.data as Asset[];
	}

	async run_backtest(
		symbol: string,
		start_date: string,
		end_date: string,
		strategy: string,
		starting_capital: number
	): Promise<BacktestResponse> {
		const response = await Citadel.post('/trading/backtest', {
			symbol,
			start_date,
			end_date,
			strategy,
			starting_capital
		});
		return response.data as BacktestResponse;
	}
}
