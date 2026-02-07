import { env } from '$env/dynamic/private';

import type {
	ClusterCertificate,
	ClusterDeployment,
	ClusterList,
	ClusterNode,
	ClusterPod,
	ClusterWarning
} from '$lib/types';

const endpoints = {
	nodes: '/nodes',
	deployments: '/deployments',
	pods: '/pods',
	warnings: '/warnings',
	certificates: '/certificates'
} as const;

const unavailable = { state: 'unavailable' } as const;

let base: URL | undefined;

const rivendellUrl = (): URL => {
	if (!base) {
		if (!env.RIVENDELL_API_URL) {
			throw new Error('RIVENDELL_API_URL is not set');
		}
		base = new URL(env.RIVENDELL_API_URL);
	}
	return base;
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const parseNode = (value: unknown): ClusterNode | undefined => {
	if (!isRecord(value)) {
		return undefined;
	}
	const {
		name,
		ready,
		memory_pressure,
		disk_pressure,
		pid_pressure,
		kubelet_version,
		cpu_capacity,
		memory_capacity,
		cpu_allocatable,
		memory_allocatable,
		cpu_usage,
		memory_usage,
		cpu_percent,
		memory_percent
	} = value;
	if (
		typeof name !== 'string' ||
		typeof ready !== 'boolean' ||
		typeof memory_pressure !== 'boolean' ||
		typeof disk_pressure !== 'boolean' ||
		typeof pid_pressure !== 'boolean' ||
		typeof kubelet_version !== 'string' ||
		typeof cpu_capacity !== 'string' ||
		typeof memory_capacity !== 'string' ||
		typeof cpu_allocatable !== 'string' ||
		typeof memory_allocatable !== 'string' ||
		typeof cpu_usage !== 'string' ||
		typeof memory_usage !== 'string' ||
		typeof cpu_percent !== 'number' ||
		typeof memory_percent !== 'number'
	) {
		return undefined;
	}
	return {
		name,
		ready,
		memory_pressure,
		disk_pressure,
		pid_pressure,
		kubelet_version,
		cpu_capacity,
		memory_capacity,
		cpu_allocatable,
		memory_allocatable,
		cpu_usage,
		memory_usage,
		cpu_percent,
		memory_percent
	};
};

const parseDeployment = (value: unknown): ClusterDeployment | undefined => {
	if (!isRecord(value)) {
		return undefined;
	}
	const { namespace, name, ready_replicas, desired_replicas, images } = value;
	if (
		typeof namespace !== 'string' ||
		typeof name !== 'string' ||
		typeof ready_replicas !== 'number' ||
		typeof desired_replicas !== 'number' ||
		!Array.isArray(images) ||
		images.some((image) => typeof image !== 'string')
	) {
		return undefined;
	}
	return { namespace, name, ready_replicas, desired_replicas, images: images as string[] };
};

const parsePod = (value: unknown): ClusterPod | undefined => {
	if (!isRecord(value)) {
		return undefined;
	}
	const { namespace, name, phase, restarts, node, created_at, cpu_usage, memory_usage, last_termination } = value;
	if (
		typeof namespace !== 'string' ||
		typeof name !== 'string' ||
		typeof phase !== 'string' ||
		typeof restarts !== 'number' ||
		typeof node !== 'string' ||
		typeof created_at !== 'string' ||
		typeof cpu_usage !== 'string' ||
		typeof memory_usage !== 'string' ||
		typeof last_termination !== 'string'
	) {
		return undefined;
	}
	return { namespace, name, phase, restarts, node, created_at, cpu_usage, memory_usage, last_termination };
};

const parseWarning = (value: unknown): ClusterWarning | undefined => {
	if (!isRecord(value)) {
		return undefined;
	}
	const { namespace, kind, name, reason, message, count, last_seen } = value;
	if (
		typeof namespace !== 'string' ||
		typeof kind !== 'string' ||
		typeof name !== 'string' ||
		typeof reason !== 'string' ||
		typeof message !== 'string' ||
		typeof count !== 'number' ||
		typeof last_seen !== 'string'
	) {
		return undefined;
	}
	return { namespace, kind, name, reason, message, count, last_seen };
};

const parseCertificate = (value: unknown): ClusterCertificate | undefined => {
	if (!isRecord(value)) {
		return undefined;
	}
	const { namespace, name, ready, not_after, renewal_time } = value;
	if (
		typeof namespace !== 'string' ||
		typeof name !== 'string' ||
		typeof ready !== 'boolean' ||
		typeof not_after !== 'string' ||
		typeof renewal_time !== 'string'
	) {
		return undefined;
	}
	return { namespace, name, ready, not_after, renewal_time };
};

const errorMessage = async (response: Response): Promise<string> => {
	const fallback = `rivendell responded ${response.status}`;
	try {
		const body: unknown = await response.json();
		if (isRecord(body) && typeof body.error === 'string') {
			return body.error;
		}
		return fallback;
	} catch {
		return fallback;
	}
};

const request = async (fetch: typeof globalThis.fetch, path: string): Promise<Response | undefined> => {
	try {
		return await fetch(new URL(path, rivendellUrl()));
	} catch (error) {
		console.error(`failed to reach rivendell for ${path}`, error);
		return undefined;
	}
};

const list = async <T>(
	fetch: typeof globalThis.fetch,
	path: string,
	parse: (value: unknown) => T | undefined
): Promise<ClusterList<T>> => {
	const response = await request(fetch, path);
	if (!response) {
		return unavailable;
	}
	if (!response.ok) {
		console.error(`rivendell rejected ${path}`, await errorMessage(response));
		return unavailable;
	}
	const body: unknown = await response.json().catch(() => undefined);
	if (!isRecord(body) || !Array.isArray(body.items)) {
		console.error(`rivendell ${path} returned an unrecognised shape`);
		return unavailable;
	}
	const items: T[] = [];
	for (const item of body.items) {
		const parsed = parse(item);
		if (!parsed) {
			console.error(`rivendell ${path} returned an unrecognised shape`);
			return unavailable;
		}
		items.push(parsed);
	}
	return { state: 'ok', items };
};

export const rivendell = (fetch: typeof globalThis.fetch) => ({
	nodes: (): Promise<ClusterList<ClusterNode>> => list(fetch, endpoints.nodes, parseNode),

	deployments: (): Promise<ClusterList<ClusterDeployment>> => list(fetch, endpoints.deployments, parseDeployment),

	pods: (): Promise<ClusterList<ClusterPod>> => list(fetch, endpoints.pods, parsePod),

	warnings: (): Promise<ClusterList<ClusterWarning>> => list(fetch, endpoints.warnings, parseWarning),

	certificates: (): Promise<ClusterList<ClusterCertificate>> => list(fetch, endpoints.certificates, parseCertificate)
});
