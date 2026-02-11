export type Alert = {
	id: string;
	type: AlertType;
	message: string;
	timeout: number;
	removing: boolean;
};

export type AlertType = 'success' | 'warning' | 'error' | 'info';
