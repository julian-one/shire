export interface LogEntry {
	time: string;
	level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
	msg: string;
	request_id?: string;
	attrs?: Record<string, unknown>;
}

export interface LogFilter {
	levels: string[];
	search: string;
	startTime: string;
	endTime: string;
}

export type LogEventType = 'log' | 'marker';

export interface LogMarker {
	type: 'historical_complete';
	time: string;
}
