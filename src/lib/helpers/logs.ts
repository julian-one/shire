import type { LogEntry, LogLevel, LogLine } from '$lib/types/logs';

const level_names: Record<string, LogLevel> = {
	error: 'ERROR',
	err: 'ERROR',
	crit: 'ERROR',
	fatal: 'ERROR',
	warn: 'WARN',
	warning: 'WARN',
	info: 'INFO',
	notice: 'INFO',
	debug: 'DEBUG',
	trace: 'DEBUG'
};

export function normalize_level(value: unknown): LogLevel {
	return typeof value === 'string' ? (level_names[value.toLowerCase()] ?? '') : '';
}

// journald syslog severity: 0-3 error, 4 warning, 5-6 informational, 7 debug.
function level_from_priority(priority: string | undefined): LogLevel {
	if (priority === undefined || priority === '') return '';
	const n = Number(priority);
	if (Number.isNaN(n)) return '';
	if (n <= 3) return 'ERROR';
	if (n === 4) return 'WARN';
	if (n <= 6) return 'INFO';
	return 'DEBUG';
}

function display_msg(entry: LogEntry): string {
	// Traefik access lines carry no message, so victorialogs substitutes its
	// "missing _msg field; see ..." placeholder — the fields tell the story.
	if (entry.msg.startsWith('missing _msg field')) {
		const { RequestMethod, RequestPath, DownstreamStatus } = entry.fields;
		if (RequestMethod && RequestPath) {
			return `${RequestMethod} ${RequestPath} ${DownstreamStatus ?? ''}`.trimEnd();
		}
		return '';
	}
	return entry.msg;
}

export function entry_to_line(entry: LogEntry): LogLine {
	const { level, ...fields } = entry.fields;
	return {
		time: entry.time,
		level: normalize_level(level) || level_from_priority(entry.fields.PRIORITY),
		msg: display_msg(entry),
		fields,
		pod: entry.pod,
		container: entry.container
	};
}

// Pod-log lines arrive as "<kubelet RFC3339 timestamp> <line>"; the three
// services emit slog JSON for the line part, everything else stays raw.
export function parse_pod_log(text: string): LogLine[] {
	return text
		.split('\n')
		.filter((line) => line.length > 0)
		.map((line) => {
			const space = line.indexOf(' ');
			const time = space > 0 ? line.slice(0, space) : '';
			const rest = space > 0 ? line.slice(space + 1) : line;
			return parse_json_line(rest, time) ?? { time, level: '' as const, msg: rest, fields: {} };
		});
}

function parse_json_line(rest: string, fallback_time: string): LogLine | undefined {
	if (!rest.startsWith('{')) return undefined;
	let raw: unknown;
	try {
		raw = JSON.parse(rest);
	} catch {
		return undefined;
	}
	if (typeof raw !== 'object' || raw === null) return undefined;
	const record = raw as Record<string, unknown>;
	if (typeof record.msg !== 'string') return undefined;
	const fields: Record<string, string> = {};
	for (const [key, value] of Object.entries(record)) {
		if (key === 'time' || key === 'level' || key === 'msg') continue;
		fields[key] = typeof value === 'string' ? value : JSON.stringify(value);
	}
	return {
		time: typeof record.time === 'string' ? record.time : fallback_time,
		level: normalize_level(record.level),
		msg: record.msg,
		fields
	};
}
