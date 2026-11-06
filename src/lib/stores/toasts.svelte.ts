const DURATION = 6000;

enum ToastType {
	Error = 'error',
	Success = 'success'
}

type Toast = {
	id: string;
	title: string;
	body?: string;
	type: ToastType;
};

type Timer = {
	timeoutId?: number;
	started: number;
	remaining: number;
};

class Toasts {
	toasts: Toast[] = $state([]);
	expanded = $state(false);
	#hovering = false;
	#focused = false;
	#backgrounded = false;
	#paused = false;
	#timers = new Map<string, Timer>();

	error(title: string, body?: string): void {
		this.#add(title, body, ToastType.Error);
	}

	success(title: string, body?: string): void {
		this.#add(title, body, ToastType.Success);
	}

	#add(title: string, body: string | undefined, type: ToastType): void {
		const id = crypto.randomUUID();
		this.toasts.unshift({ id, title, body, type });
		const timer: Timer = { started: Date.now(), remaining: DURATION };
		this.#timers.set(id, timer);
		if (this.#paused) {
			return;
		}
		timer.timeoutId = window.setTimeout(() => {
			this.remove(id);
		}, DURATION);
	}

	toggle(): void {
		this.expanded = !this.expanded;
		this.#sync();
	}

	collapse(): void {
		this.expanded = false;
		this.#sync();
	}

	hover(hovering: boolean): void {
		this.#hovering = hovering;
		this.#sync();
	}

	focus(focused: boolean): void {
		this.#focused = focused;
		this.#sync();
	}

	background(backgrounded: boolean): void {
		this.#backgrounded = backgrounded;
		this.#sync();
	}

	remove(id: string): void {
		clearTimeout(this.#timers.get(id)?.timeoutId);
		this.#timers.delete(id);
		this.toasts = this.toasts.filter((toast) => toast.id !== id);
		if (this.toasts.length === 0) {
			this.expanded = false;
			this.#hovering = false;
			this.#focused = false;
			this.#sync();
		}
	}

	#sync(): void {
		const paused = this.expanded || this.#hovering || this.#focused || this.#backgrounded;
		if (paused === this.#paused) {
			return;
		}
		this.#paused = paused;
		const now = Date.now();
		for (const [id, timer] of this.#timers) {
			if (paused) {
				clearTimeout(timer.timeoutId);
				timer.timeoutId = undefined;
				timer.remaining -= now - timer.started;
				continue;
			}
			timer.started = now;
			timer.timeoutId = window.setTimeout(() => {
				this.remove(id);
			}, timer.remaining);
		}
	}
}

const ToastStore = new Toasts();

export { ToastStore, ToastType };
