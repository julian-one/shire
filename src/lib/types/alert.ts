export type Alert = {
	id: string;
	type: AlertType;
	message: string;
	removing: boolean;
};

export type AlertType = 'success' | 'warning' | 'error' | 'info';

export const AlertClassMap = new Map<AlertType, string>([
	['info', 'alert-info'],
	['success', 'alert-success'],
	['warning', 'alert-warning'],
	['error', 'alert-error']
]);
