<script lang="ts">
	let {
		src,
		alt,
		recipe_id,
		is_detail = false
	} = $props<{
		src: string | null | undefined;
		alt: string;
		recipe_id?: string;
		is_detail?: boolean;
	}>();

	let has_error = $state(false);
</script>

{#if src && !has_error}
	<div
		class="bg-base-200/50 border-base-content/10 overflow-hidden"
		class:rounded-xl={is_detail}
		class:sm:rounded-2xl={is_detail}
		class:border={is_detail}
		class:border-b={!is_detail}
	>
		<a
			href={is_detail ? src : `/recipes/${recipe_id}`}
			target={is_detail ? '_blank' : undefined}
			rel={is_detail ? 'noopener noreferrer' : undefined}
			class="block w-full {is_detail ? 'cursor-zoom-in' : ''}"
		>
			<img
				{src}
				{alt}
				loading="lazy"
				onerror={() => (has_error = true)}
				class="mx-auto w-full object-cover object-center"
				class:h-64={!is_detail}
				class:md:h-80={!is_detail}
				class:h-48={is_detail}
				class:md:h-64={is_detail}
			/>
		</a>
	</div>
{/if}
