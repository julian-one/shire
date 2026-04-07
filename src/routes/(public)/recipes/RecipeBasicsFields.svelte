<script lang="ts">
	import type { Cuisine, Category } from '$lib/types/recipe';
	import { cuisine_form_options, category_form_options } from './form';

	let {
		title = $bindable(),
		description = $bindable(),
		photo_url = $bindable(),
		source_url = $bindable(),
		cook_time = $bindable(),
		serves = $bindable(),
		cuisine = $bindable(),
		category = $bindable()
	}: {
		title: string;
		description: string;
		photo_url: string;
		source_url: string;
		cook_time: string;
		serves: string;
		cuisine: Cuisine | '';
		category: Category | '';
	} = $props();
</script>

<div>
	<label
		for="title"
		class="text-base-content/60 text-sm font-bold tracking-wide uppercase"
	>
		Title
	</label>
	<input
		type="text"
		class="input validator mt-2 w-full"
		placeholder="Recipe title"
		id="title"
		bind:value={title}
		required
	/>
	<div class="validator-hint hidden">Required</div>
</div>

<div>
	<label
		for="description"
		class="text-base-content/60 text-sm font-bold tracking-wide uppercase"
	>
		Description
	</label>
	<textarea
		class="textarea mt-2 w-full"
		placeholder="A short description (optional)"
		id="description"
		bind:value={description}
		rows="3"
	></textarea>
</div>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
	<div>
		<label
			for="photo_url"
			class="text-base-content/60 text-sm font-bold tracking-wide uppercase"
		>
			Photo URL
		</label>
		<input
			type="url"
			class="input validator mt-2 w-full"
			placeholder="https://example.com/photo.jpg"
			id="photo_url"
			bind:value={photo_url}
		/>
		<div class="validator-hint hidden">Enter a valid URL</div>
	</div>
	<div>
		<label
			for="source_url"
			class="text-base-content/60 text-sm font-bold tracking-wide uppercase"
		>
			Source URL
		</label>
		<input
			type="url"
			class="input validator mt-2 w-full"
			placeholder="https://example.com/recipe"
			id="source_url"
			bind:value={source_url}
		/>
		<div class="validator-hint hidden">Enter a valid URL</div>
	</div>
</div>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
	<div>
		<label
			for="cook_time"
			class="text-base-content/60 text-sm font-bold tracking-wide uppercase"
		>
			Cook Time (mins)
		</label>
		<input
			type="number"
			class="input validator mt-2 w-full"
			placeholder="e.g. 45"
			id="cook_time"
			min="1"
			bind:value={cook_time}
		/>
		<div class="validator-hint hidden">Must be at least 1</div>
	</div>
	<div>
		<label
			for="serves"
			class="text-base-content/60 text-sm font-bold tracking-wide uppercase"
		>
			Serves (people)
		</label>
		<input
			type="number"
			class="input validator mt-2 w-full"
			placeholder="e.g. 4"
			id="serves"
			min="1"
			bind:value={serves}
		/>
		<div class="validator-hint hidden">Must be at least 1</div>
	</div>
	<div>
		<label
			for="cuisine"
			class="text-base-content/60 text-sm font-bold tracking-wide uppercase"
		>
			Cuisine
		</label>
		<select
			class="select mt-2 w-full"
			bind:value={cuisine}
		>
			{#each cuisine_form_options as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
	<div>
		<label
			for="category"
			class="text-base-content/60 text-sm font-bold tracking-wide uppercase"
		>
			Category
		</label>
		<select
			class="select mt-2 w-full"
			bind:value={category}
		>
			{#each category_form_options as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
</div>
