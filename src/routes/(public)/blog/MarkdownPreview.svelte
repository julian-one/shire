<script lang="ts">
	import { render_markdown } from './markdown';

	type Props = {
		content: string;
	};

	let { content }: Props = $props();

	let html = $derived(render_markdown(content));
</script>

<div class="prose prose-lg max-w-none leading-relaxed">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- sanitized by DOMPurify -->
	{@html html}
</div>
