export type ClusterNode = {
	name: string;
	status: string;
	roles: string[];
	os_image: string;
	architecture: string;
	kubelet_version: string;
	cpu_capacity: string;
	memory_capacity_mb: number;
	created_at: string;
	uptime_days: number;
	cpu_usage_nano: number;
	memory_usage_kb: number;
	internal_ip: string;
};

export type PodInfo = {
	name: string;
	status: string;
	cpu_usage_nano: number;
	memory_usage_kb: number;
};

export type NamespaceSummary = {
	namespace: string;
	total: number;
	running: number;
	pending: number;
	failed: number;
	pods: PodInfo[];
};

export type ClusterSummary = {
	total_nodes: number;
	nodes_ready: number;
	total_pods: number;
	pods_running: number;
};

export type ClusterHealth = {
	nodes: ClusterNode[];
	namespaces: NamespaceSummary[];
	summary: ClusterSummary;
};
