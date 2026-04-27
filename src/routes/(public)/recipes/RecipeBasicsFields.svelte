<script lang="ts">
	import { SourceType, type Cuisine, type Category } from '$lib/types/recipe';
	import { cuisine_form_options, category_form_options, source_type_form_options } from './form';

	let {
		title = $bindable(),
		description = $bindable(),
		photo_url = $bindable(),
		source_type = $bindable(),
		source = $bindable(),
		prep_time = $bindable(),
		cook_time = $bindable(),
		serves = $bindable(),
		cuisine = $bindable(),
		category = $bindable()
	}: {
		title: string;
		description: string;
		photo_url: string;
		source_type: SourceType | '';
		source: string;
		prep_time: string;
		cook_time: string;
		serves: string;
		cuisine: Cuisine | '';
		category: Category | '';
	} = $props();

	let source_placeholder = $derived(
		source_type === SourceType.URL
			? 'https://example.com/recipe'
			: source_type === SourceType.Book
				? 'e.g. Cravings'
				: source_type === SourceType.Personal
					? "e.g. Grandma's recipe"
					: ''
	);
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
	<div class="flex flex-col gap-4 sm:flex-row sm:gap-6">
		<div class="w-full sm:w-1/3">
			<label
				for="source_type"
				class="text-base-content/60 text-sm font-bold tracking-wide uppercase"
			>
				Source Type
			</label>
			<select
				class="select mt-2 w-full"
				id="source_type"
				bind:value={source_type}
			>
				{#each source_type_form_options as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>
		{#if source_type}
			<div class="w-full sm:flex-1">
				<label
					for="source"
					class="text-base-content/60 text-sm font-bold tracking-wide uppercase"
				>
					Source
				</label>
				{#if source_type === SourceType.URL}
					<input
						type="url"
						class="input validator mt-2 w-full"
						placeholder={source_placeholder}
						id="source"
						bind:value={source}
					/>
					<div class="validator-hint hidden">Enter a valid URL</div>
				{:else}
					<input
						type="text"
						class="input mt-2 w-full"
						placeholder={source_placeholder}
						id="source"
						bind:value={source}
					/>
				{/if}
			</div>
		{/if}
	</div>
</div>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
	<div>
		<label
			for="prep_time"
			class="text-base-content/60 text-sm font-bold tracking-wide uppercase"
		>
			Prep Time (mins)
		</label>
		<input
			type="number"
			class="input validator mt-2 w-full"
			placeholder="e.g. 15"
			id="prep_time"
			min="1"
			bind:value={prep_time}
		/>
		<div class="validator-hint hidden">Must be at least 1</div>
	</div>
	<div>
		<label
			for="cook_time"
			class="text-base-content/60 text-sm font-bold tracking-wide uppercase"
		>
			Total Time (mins)
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
