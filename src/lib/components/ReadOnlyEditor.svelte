<script lang="ts">
	import { onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';

	type Props = {
		content: string;
	};

	let { content }: Props = $props();

	let element: HTMLDivElement | undefined = $state();
	let editor: Editor | undefined = $state();

	onMount(() => {
		editor = new Editor({
			element: element!,
			extensions: [StarterKit],
			content: content ? JSON.parse(content) : '',
			editable: false
		});

		return () => {
			editor?.destroy();
		};
	});

	$effect(() => {
		if (editor && content !== undefined) {
			const current = JSON.stringify(editor.getJSON());
			if (current !== content) {
				editor.commands.setContent(content ? JSON.parse(content) : '');
			}
		}
	});
</script>

<div
	bind:this={element}
	class="prose prose-lg max-w-none leading-relaxed"
></div>
