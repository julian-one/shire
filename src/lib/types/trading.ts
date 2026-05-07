export interface TradingAccount {
	id: string;
	account_number: string;
	status: string;
	crypto_status: string;
	currency: string;
	buying_power: string;
	regt_buying_power: string;
	daytrading_buying_power: string;
	cash: string;
	portfolio_value: string;
	pattern_day_trader: boolean;
	trading_blocked: boolean;
	transfers_blocked: boolean;
	account_blocked: boolean;
	created_at: string;
	trade_suspended_by_user: boolean;
	multiplier: string;
	shorting_enabled: boolean;
	equity: string;
	last_equity: string;
	long_market_value: string;
	short_market_value: string;
	initial_margin: string;
	maintenance_margin: string;
	last_maintenance_margin: string;
	sma: string;
	daytrade_count: number;
}

export interface StockBar {
	t: string; // Timestamp
	o: number; // Open
	h: number; // High
	l: number; // Low
	c: number; // Close
	v: number; // Volume
	n: number; // TradeCount
	vw: number; // VWAP
}

export interface Asset {
	id: string;
	class: string;
	exchange: string;
	symbol: string;
	name: string;
	status: string;
	tradable: boolean;
}

export interface EquitySnapshot {
	timestamp: string;
	equity: number;
}

export interface Trade {
	timestamp: string;
	symbol: string;
	side: 'buy' | 'sell';
	quantity: number;
	price: number;
}

export interface Metrics {
	total_return: number;
	max_drawdown: number;
	sharpe_ratio: number;
}

export interface Portfolio {
	cash: number;
	positions: Record<string, number>;
	trades: Trade[];
	equity_log: EquitySnapshot[];
	metrics: Metrics;
}

export interface BacktestResponse {
	portfolio: Portfolio;
}

export interface TradingSession {
	session_id: string;
	strategy: string;
	status: string;
	started_at: string;
	ended_at: string | null;
}

export interface TradingOrder {
	order_id: string;
	session_id: string;
	client_order_id: string | null;
	symbol: string;
	side: string;
	type: string;
	qty: number;
	filled_qty: number;
	avg_price: number | null;
	status: string;
	created_at: string;
	updated_at: string;
}

export interface TradingSessionDetails {
	session: TradingSession;
	orders: TradingOrder[];
}

export interface BacktestRecord {
	backtest_id: string;
	strategy: string;
	symbols: string;
	start_date: string;
	end_date: string;
	starting_capital: number;
	parameters: string;
	metrics: string;
	created_at: string;
}

export interface Position {
	asset_id: string;
	symbol: string;
	exchange: string;
	asset_class: string;
	avg_entry_price: string;
	qty: string;
	side: string;
	market_value: string;
	cost_basis: string;
	unrealized_pl: string;
	unrealized_plpc: string;
	unrealized_intraday_pl: string;
	unrealized_intraday_plpc: string;
	current_price: string;
	lastday_price: string;
	change_today: string;
}

export interface PortfolioHistory {
	timestamp: number[];
	equity: number[];
	profit_loss: number[];
	profit_loss_pct: number[];
	base_value: number;
	timeframe: string;
}

export interface PlaceOrderRequest {
	symbol: string;
	quantity: number;
	side: 'buy' | 'sell';
	type: 'market' | 'limit';
	limit?: number;
}
