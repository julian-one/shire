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
