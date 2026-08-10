export interface ProbeSpec {
	id: string;
	method: string;
	path: string;
	description: string;
	expect: number;
}

export interface ProbeResult {
	id: string;
	status: number; // 0 = unreachable or timed out
	pass: boolean;
	duration_ms: number;
	detail: string;
}
