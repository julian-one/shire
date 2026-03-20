<script lang="ts">
	let {
		instructions = $bindable()
	}: {
		instructions: string[];
	} = $props();

	function add_instruction() {
		instructions = [...instructions, ''];
	}

	function remove_instruction(index: number) {
		instructions = instructions.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each instructions.map((_, i) => i) as index (index)}
		<div class="flex gap-2">
			<span class="bg-base-200 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold">
				{index + 1}
			</span>
			<div class="w-full">
				<textarea
					class="textarea validator w-full"
					placeholder="Describe this step"
					required
					bind:value={instructions[index]}
					rows="2"
				></textarea>
				<div class="validator-hint hidden">Required</div>
			</div>
			{#if instructions.length > 1}
				<button
					type="button"
					class="btn btn-ghost btn-square"
					onclick={() => remove_instruction(index)}
					aria-label="Remove instruction"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-5 w-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			{/if}
		</div>
	{/each}
</div>

<button
	type="button"
	class="btn btn-soft btn-sm"
	onclick={add_instruction}
>
	+ Add step
</button>
