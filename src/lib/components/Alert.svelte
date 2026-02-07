<script lang="ts">
	import { AlertStore } from '$lib/stores/alert.svelte';
</script>

{#each AlertStore.alerts as alert (alert.id)}
	{#if alert.type === 'success'}
		<div
			role="alert"
			class="alert alert-success shadow-lg transition-opacity duration-300 ease-out"
			class:opacity-0={alert.removing}
		>
			<!-- Icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<!-- Progress bar -->
			<div>
				<h3 class="font-bold">{alert.message}</h3>
				<progress
					class="progress mt-2"
					value={alert.timeout}
					max="100"
				></progress>
			</div>
			<!-- Dismiss button -->
			<button
				type="button"
				class="cursor-pointer border-none bg-transparent p-0 font-normal underline"
				onclick={() => {
					AlertStore.remove(alert.id);
				}}
			>
				Dismiss
			</button>
		</div>
	{:else if alert.type === 'warning'}
		<div
			role="alert"
			class="alert alert-warning shadow-lg transition-opacity duration-300 ease-out"
			class:opacity-0={alert.removing}
		>
			<!-- Icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
			<!-- Progress bar -->
			<div>
				<h3 class="font-bold">{alert.message}</h3>
				<progress
					class="progress mt-2"
					value={alert.timeout}
					max="100"
				></progress>
			</div>
			<!-- Dismiss button -->
			<button
				type="button"
				class="cursor-pointer border-none bg-transparent p-0 font-normal underline"
				onclick={() => {
					AlertStore.remove(alert.id);
				}}
			>
				Dismiss
			</button>
		</div>
	{:else if alert.type === 'error'}
		<div
			role="alert"
			class="alert alert-error shadow-lg transition-opacity duration-300 ease-out"
			class:opacity-0={alert.removing}
		>
			<!-- Icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<!-- Progress bar -->
			<div>
				<h3 class="font-bold">{alert.message}</h3>
				<progress
					class="progress mt-2"
					value={alert.timeout}
					max="100"
				></progress>
			</div>
			<!-- Dismiss button -->
			<button
				type="button"
				class="cursor-pointer border-none bg-transparent p-0 font-normal underline"
				onclick={() => {
					AlertStore.remove(alert.id);
				}}
			>
				Dismiss
			</button>
		</div>
	{/if}
{/each}
