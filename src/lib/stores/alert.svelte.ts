import { v4 as uuid } from 'uuid';
import type { Alert, AlertType } from '../types/alert';

class Alerts {
	public alerts: Alert[] = $state([]);

	public add(message: string, type: AlertType = 'info'): void {
		const id = uuid();
		this.alerts = [...this.alerts, { id, type, message, removing: false }];
		setTimeout(() => this.remove(id), 4000);
	}

	public remove(id: string): void {
		const alert = this.alerts.find((a) => a.id === id);
		if (alert) {
			alert.removing = true;
			this.alerts = [...this.alerts];
			setTimeout(() => {
				this.alerts = this.alerts.filter((a) => a.id !== id);
			}, 300);
		}
	}
}

export const AlertStore = new Alerts();
