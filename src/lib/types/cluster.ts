export type ClusterNode = {
	name: string;
	ready: boolean;
	memory_pressure: boolean;
	disk_pressure: boolean;
	pid_pressure: boolean;
	kubelet_version: string;
	cpu_capacity: string;
	memory_capacity: string;
	cpu_allocatable: string;
	memory_allocatable: string;
	cpu_usage: string;
	memory_usage: string;
	cpu_percent: number;
	memory_percent: number;
};

export type ClusterDeployment = {
	namespace: string;
	name: string;
	ready_replicas: number;
	desired_replicas: number;
	images: string[];
};

export type ClusterPod = {
	namespace: string;
	name: string;
	phase: string;
	restarts: number;
	node: string;
	created_at: string;
	cpu_usage: string;
	memory_usage: string;
	last_termination: string;
};

export type ClusterWarning = {
	namespace: string;
	kind: string;
	name: string;
	reason: string;
	message: string;
	count: number;
	last_seen: string;
};

export type ClusterCertificate = {
	namespace: string;
	name: string;
	ready: boolean;
	not_after: string;
	renewal_time: string;
};

export type ClusterList<T> = { state: 'ok'; items: T[] } | { state: 'unavailable' };
