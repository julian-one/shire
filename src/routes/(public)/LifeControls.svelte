<script lang="ts">
	import { PauseIcon, PlayIcon, SkipForwardIcon, SlidersHorizontalIcon } from 'phosphor-svelte';
	import { life } from '#lib/stores/life.svelte.js';
</script>

<section
	class="absolute inset-x-0 bottom-1 flex justify-center md:static md:-mt-6 md:h-0 md:items-start md:justify-end"
	aria-label="Game of Life"
>
	<div
		class="card flex-row items-center gap-1 border-base-300 bg-base-100 p-1 card-border"
		style="anchor-name: --life-settings"
	>
		<button
			class="btn btn-square size-11 btn-ghost"
			type="button"
			aria-label={life.running ? 'Pause' : 'Play'}
			onclick={() => {
				life.toggle();
			}}
		>
			{#if life.running}
				<PauseIcon class="size-5" aria-hidden="true" />
			{:else}
				<PlayIcon class="size-5" aria-hidden="true" />
			{/if}
		</button>
		<button
			class="btn btn-square size-11 btn-ghost"
			type="button"
			aria-label="Step one generation"
			onclick={() => {
				life.step();
			}}
		>
			<SkipForwardIcon class="size-5" aria-hidden="true" />
		</button>
		<button
			class="btn btn-square size-11 btn-ghost"
			type="button"
			popovertarget="life-settings"
			aria-label="Details and settings"
		>
			<SlidersHorizontalIcon class="size-5" aria-hidden="true" />
		</button>
		<div
			id="life-settings"
			class="dropdown dropdown-center dropdown-top mb-1.5 w-64 rounded-box border-2 border-base-300 bg-base-100 px-3 py-1.5 md:dropdown-end md:dropdown-bottom md:mt-1.5 md:mb-0"
			popover
			style="position-anchor: --life-settings"
		>
			<dl class="stats w-full rounded-none border-b-2 border-base-300">
				<div class="stat px-0 py-2">
					<dt class="stat-title text-xs text-secondary">Time</dt>
					<dd class="stat-value text-lg tabular-nums">{life.generation}</dd>
				</div>
				<div class="stat py-2 ps-3 pe-0">
					<dt class="stat-title text-xs text-secondary">Population</dt>
					<dd class="stat-value text-lg tabular-nums">{life.population}</dd>
				</div>
			</dl>
			<label class="flex min-h-11 items-center gap-3 text-sm">
				<span class="w-12 shrink-0 text-secondary">Speed</span>
				<input
					class="range grow range-sm"
					type="range"
					min="1"
					max="20"
					value={life.speed}
					oninput={(event) => {
						life.setSpeed(Number(event.currentTarget.value));
					}}
				/>
			</label>
			<label class="flex min-h-11 items-center gap-3 text-sm">
				<span class="w-12 shrink-0 text-secondary">Size</span>
				<input
					class="range grow range-sm"
					type="range"
					min="4"
					max="24"
					step="2"
					value={life.cellSize}
					onchange={(event) => {
						life.setCellSize(Number(event.currentTarget.value));
					}}
				/>
			</label>
		</div>
	</div>
</section>
