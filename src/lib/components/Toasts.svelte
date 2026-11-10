<script lang="ts">
	import { ToastStore, ToastType } from '#lib/stores/toasts.svelte.js';
	import { tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { CaretDownIcon, CheckCircleIcon, WarningCircleIcon, XIcon } from 'phosphor-svelte';

	const stackId = $props.id();
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const collapsed = $derived(!ToastStore.expanded);

	let region: HTMLElement | undefined;
	let returnTo: HTMLElement | undefined;

	async function dismiss(id: string) {
		const hadFocus = region?.contains(document.activeElement) ?? false;
		const index = ToastStore.toasts.findIndex((toast) => {
			return toast.id === id;
		});
		ToastStore.remove(id);
		if (!hadFocus) {
			ToastStore.focus(false);
			return;
		}
		await tick();
		let next = ToastStore.toasts[index];
		if (!next) {
			next = ToastStore.toasts[index - 1];
		}
		if (!next) {
			returnTo?.focus();
			returnTo = undefined;
			return;
		}
		const button = region?.querySelector(`[data-dismiss="${next.id}"]`);
		if (button instanceof HTMLElement) {
			button.focus();
			return;
		}
		ToastStore.focus(false);
	}

	function onfocusin(event: FocusEvent & { currentTarget: HTMLElement }) {
		const previous = event.relatedTarget;
		const fromOutside = previous instanceof HTMLElement && !event.currentTarget.contains(previous);
		if (fromOutside) {
			returnTo = previous;
		}
		ToastStore.focus(true);
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') {
			return;
		}
		const target = event.target;
		const inside = target instanceof Node && region?.contains(target);
		if (!inside) {
			return;
		}
		if (ToastStore.expanded) {
			ToastStore.collapse();
			return;
		}
		const newest = ToastStore.toasts[0];
		if (newest) {
			dismiss(newest.id);
		}
	}

	function onfocusout(event: FocusEvent & { currentTarget: HTMLElement }) {
		const next = event.relatedTarget;
		if (next instanceof Node && event.currentTarget.contains(next)) {
			return;
		}
		returnTo = undefined;
		ToastStore.focus(false);
	}
</script>

<svelte:window {onkeydown} />

<svelte:document
	onvisibilitychange={() => {
		ToastStore.background(document.hidden);
	}}
/>

<section
	bind:this={region}
	class={[
		'toast toast-end inset-s-4 toast-top z-50 w-auto md:inset-s-auto md:w-100',
		{ 'pointer-events-none bottom-4': ToastStore.expanded }
	]}
	aria-label="Notifications"
	onmouseenter={() => {
		ToastStore.hover(true);
	}}
	onmouseleave={() => {
		ToastStore.hover(false);
	}}
	{onfocusin}
	{onfocusout}
>
	<div
		id={stackId}
		class={[
			'grid w-full gap-2',
			{ 'pointer-events-auto min-h-0 overflow-y-auto overscroll-contain': ToastStore.expanded }
		]}
		aria-live="polite"
	>
		{#each ToastStore.toasts as toast, index (toast.id)}
			{@const isError = toast.type === ToastType.Error}
			<div
				animate:flip={{ duration }}
				transition:fly={{ y: -16, duration }}
				class={[
					'relative alert origin-top items-start gap-3 rounded-box border-0 alert-soft p-4 text-base motion-safe:transition-transform',
					isError ? 'alert-error' : 'alert-success',
					collapsed && index > 2 ? 'hidden' : 'flex',
					{
						'col-start-1 row-start-1': collapsed,
						'z-30': collapsed && index === 0,
						'z-20 translate-y-4 scale-95': collapsed && index === 1,
						'z-10 translate-y-8 scale-90': collapsed && index === 2
					}
				]}
				role={isError ? 'alert' : undefined}
				inert={collapsed && index > 0}
			>
				{#if isError}
					<WarningCircleIcon class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
				{:else}
					<CheckCircleIcon class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
				{/if}
				<p class="flex-1">
					<strong class="font-bold">{toast.title}</strong>
					{#if toast.body}
						{toast.body}
					{/if}
				</p>
				{#if ToastStore.toasts.length > 1}
					<button
						class="btn btn-circle btn-ghost btn-xs after:absolute after:inset-0"
						type="button"
						aria-label="All notifications"
						aria-expanded={ToastStore.expanded}
						aria-controls={stackId}
						onclick={() => {
							ToastStore.toggle();
						}}
					>
						<CaretDownIcon
							class={[
								'size-4 motion-safe:transition-transform',
								{ 'rotate-180': ToastStore.expanded }
							]}
							aria-hidden="true"
						/>
					</button>
				{/if}
				<button
					class="btn relative btn-circle btn-ghost btn-xs"
					type="button"
					aria-label="Dismiss"
					data-dismiss={toast.id}
					onclick={() => {
						dismiss(toast.id);
					}}
				>
					<XIcon class="size-4" aria-hidden="true" />
				</button>
			</div>
		{/each}
	</div>
</section>
