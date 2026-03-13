export type LogEntry = {
	time: string;
	level: string;
	msg: string;
	method?: string;
	path?: string;
	status?: number;
	duration?: number;
	request_id?: string;
};

export type LogResponse = {
	source: string;
	entries: LogEntry[];
	count: number;
	error?: string;
};
