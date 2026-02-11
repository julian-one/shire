import { v4 as uuid } from 'uuid';
import type { Alert, AlertType } from '../types/alert';

class Alerts {
	public alerts: Alert[] = $state([]);

	private tick(id: string) {
		const alert = this.alerts.find((a) => a.id === id);
		if (!alert) return;

		const duration = 4000; // 4 seconds
		let startTime: number | null = null;

		const frame = (timestamp: number) => {
			if (!startTime) {
				startTime = timestamp;
			}
			const elapsed = timestamp - startTime;
			const progress = (elapsed / duration) * 100;

			if (progress >= 100) {
				this.remove(id);
				return;
			}

			alert.timeout = progress;
			if (this.alerts.find((a) => a.id === id)) {
				requestAnimationFrame(frame);
			}
		};

		requestAnimationFrame(frame);
	}

	public add(message: string, type: AlertType = 'info'): void {
		const id = uuid();
		this.alerts = [...this.alerts, { id, type, message, timeout: 0, removing: false }];
		this.tick(id);
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

	public clear(): void {
		this.alerts = [];
	}
}

export const AlertStore = new Alerts();
