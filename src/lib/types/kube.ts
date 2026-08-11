export interface KubeContainer {
	name: string;
	ready: boolean;
	restarts: number;
}

export interface KubePod {
	name: string;
	phase: string;
	node: string;
	start_time: string;
	containers: KubeContainer[];
}
