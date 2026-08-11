import process from 'node:process';

export function log(level: 'INFO' | 'ERROR', msg: string, fields: Record<string, unknown> = {}) {
	process.stdout.write(JSON.stringify({ time: new Date().toISOString(), level, msg, ...fields }) + '\n');
}
