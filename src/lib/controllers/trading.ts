import { Citadel } from '$lib/controllers/citadel';
import type {
	TradingAccount,
	StockBar,
	Asset,
	BacktestResponse,
	TradingSession,
	TradingSessionDetails,
	BacktestRecord,
	Position,
	PortfolioHistory,
	PlaceOrderRequest,
	TradingOrder
} from '$lib/types/trading';

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
		symbols: string[],
		start_date: string,
		end_date: string,
		strategy: string,
		starting_capital: number,
		parameters: Record<string, unknown> = {}
	): Promise<BacktestResponse> {
		const response = await Citadel.post('/trading/backtest', {
			symbols,
			start_date,
			end_date,
			strategy,
			starting_capital,
			parameters
		});
		return response.data as BacktestResponse;
	}

	async list_live_sessions(): Promise<TradingSession[]> {
		const response = await Citadel.get('/trading/sessions');
		// The API returns an array or null if empty
		return (response.data || []) as TradingSession[];
	}

	async get_live_session_details(session_id: string): Promise<TradingSessionDetails> {
		const response = await Citadel.get(`/trading/sessions/${session_id}`);
		return response.data as TradingSessionDetails;
	}

	async start_live_session(
		symbols: string[],
		strategy: string,
		starting_capital: number,
		parameters: Record<string, unknown> = {}
	): Promise<{ message: string; session_id: string }> {
		const response = await Citadel.post('/trading/live/start', {
			symbols,
			strategy,
			starting_capital,
			parameters
		});
		return response.data as { message: string; session_id: string };
	}

	async stop_live_session(session_id: string): Promise<{ message: string }> {
		const response = await Citadel.post(`/trading/live/stop?session_id=${session_id}`);
		return response.data as { message: string };
	}

	async list_backtests(): Promise<BacktestRecord[]> {
		const response = await Citadel.get('/trading/backtests');
		return (response.data || []) as BacktestRecord[];
	}

	async get_positions(): Promise<Position[]> {
		const response = await Citadel.get('/trading/positions');
		return (response.data || []) as Position[];
	}

	async get_portfolio_history(period: string = '1M', timeframe: string = '1D'): Promise<PortfolioHistory> {
		const response = await Citadel.get(`/trading/portfolio/history?period=${period}&timeframe=${timeframe}`);
		return response.data as PortfolioHistory;
	}

	async place_order(req: PlaceOrderRequest): Promise<TradingOrder> {
		const response = await Citadel.post('/trading/orders', req);
		return response.data as TradingOrder;
	}
}
