export interface LogEntry {
	time: string;
	pod: string;
	container: string;
	msg: string;
	fields: Record<string, string>;
}

export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | '';

export interface LogLine {
	time: string;
	level: LogLevel;
	msg: string;
	fields: Record<string, string>;
	pod?: string;
	container?: string;
}
