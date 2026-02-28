<script lang="ts">
	import { onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';

	type Props = {
		content?: string;
		disabled?: boolean;
		onchange?: (json: string) => void;
	};

	let { content = '', disabled = false, onchange }: Props = $props();

	let element: HTMLDivElement | undefined = $state();
	let editor: Editor | undefined = $state();

	onMount(() => {
		editor = new Editor({
			element: element!,
			extensions: [StarterKit],
			content: content ? JSON.parse(content) : '',
			editable: !disabled,
			onTransaction: () => {
				editor = editor;
			},
			onUpdate: ({ editor: e }) => {
				onchange?.(JSON.stringify(e.getJSON()));
			}
		});

		return () => {
			editor?.destroy();
		};
	});

	$effect(() => {
		editor?.setEditable(!disabled);
	});

	$effect(() => {
		if (editor && content !== undefined) {
			const current = JSON.stringify(editor.getJSON());
			if (current !== content) {
				editor.commands.setContent(content ? JSON.parse(content) : '');
			}
		}
	});

	function is_valid_url(str: string): boolean {
		try {
			const url = new URL(str);
			return url.protocol === 'http:' || url.protocol === 'https:';
		} catch {
			return false;
		}
	}

	function set_link() {
		if (!editor) return;
		const prev = editor.getAttributes('link').href;
		const url = prompt('URL', prev ?? 'https://');
		if (url === null) return;
		if (url === '') {
			editor.chain().focus().unsetLink().run();
			return;
		}
		if (!is_valid_url(url)) {
			alert('Please enter a valid URL starting with http:// or https://');
			return;
		}
		editor.chain().focus().setLink({ href: url }).run();
	}
</script>

<div class="editor-wrap rounded-box border-base-content/20 border">
	{#if editor}
		<div class="toolbar border-base-content/20 flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
			<!-- Text style group -->
			<button
				type="button"
				class="btn btn-ghost btn-xs {editor.isActive('bold') ? 'btn-active' : ''}"
				onclick={() => editor?.chain().focus().toggleBold().run()}
				title="Bold"
				{disabled}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
				</svg>
			</button>
			<button
				type="button"
				class="btn btn-ghost btn-xs {editor.isActive('italic') ? 'btn-active' : ''}"
				onclick={() => editor?.chain().focus().toggleItalic().run()}
				title="Italic"
				{disabled}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line
						x1="19"
						y1="4"
						x2="10"
						y2="4"
					/><line
						x1="14"
						y1="20"
						x2="5"
						y2="20"
					/><line
						x1="15"
						y1="4"
						x2="9"
						y2="20"
					/>
				</svg>
			</button>
			<button
				type="button"
				class="btn btn-ghost btn-xs {editor.isActive('underline') ? 'btn-active' : ''}"
				onclick={() => editor?.chain().focus().toggleUnderline().run()}
				title="Underline"
				{disabled}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" /><line
						x1="4"
						y1="21"
						x2="20"
						y2="21"
					/>
				</svg>
			</button>
			<button
				type="button"
				class="btn btn-ghost btn-xs {editor.isActive('strike') ? 'btn-active' : ''}"
				onclick={() => editor?.chain().focus().toggleStrike().run()}
				title="Strikethrough"
				{disabled}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M16 4H9a3 3 0 0 0-3 3 3 3 0 0 0 3 3h6" /><line
						x1="4"
						y1="12"
						x2="20"
						y2="12"
					/><path d="M15 12a3 3 0 0 1 0 6H8" />
				</svg>
			</button>
			<button
				type="button"
				class="btn btn-ghost btn-xs {editor.isActive('code') ? 'btn-active' : ''}"
				onclick={() => editor?.chain().focus().toggleCode().run()}
				title="Inline Code"
				{disabled}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
				</svg>
			</button>

			<div class="divider divider-horizontal mx-0.5 w-0"></div>

			<!-- Heading group -->
			<button
				type="button"
				class="btn btn-ghost btn-xs {editor.isActive('heading', { level: 1 }) ? 'btn-active' : ''}"
				onclick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
				title="Heading 1"
				{disabled}
			>
				H1
			</button>
			<button
				type="button"
				class="btn btn-ghost btn-xs {editor.isActive('heading', { level: 2 }) ? 'btn-active' : ''}"
				onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
				title="Heading 2"
				{disabled}
			>
				H2
			</button>
			<button
				type="button"
				class="btn btn-ghost btn-xs {editor.isActive('heading', { level: 3 }) ? 'btn-active' : ''}"
				onclick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
				title="Heading 3"
				{disabled}
			>
				H3
			</button>

			<div class="divider divider-horizontal mx-0.5 w-0"></div>

			<!-- Block group -->
			<button
				type="button"
				class="btn btn-ghost btn-xs {editor.isActive('bulletList') ? 'btn-active' : ''}"
				onclick={() => editor?.chain().focus().toggleBulletList().run()}
				title="Bullet List"
				{disabled}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line
						x1="8"
						y1="6"
						x2="21"
						y2="6"
					/><line
						x1="8"
						y1="12"
						x2="21"
						y2="12"
					/><line
						x1="8"
						y1="18"
						x2="21"
						y2="18"
					/>
					<circle
						cx="3.5"
						cy="6"
						r="1"
						fill="currentColor"
					/><circle
						cx="3.5"
						cy="12"
						r="1"
						fill="currentColor"
					/><circle
						cx="3.5"
						cy="18"
						r="1"
						fill="currentColor"
					/>
				</svg>
			</button>
			<button
				type="button"
				class="btn btn-ghost btn-xs {editor.isActive('orderedList') ? 'btn-active' : ''}"
				onclick={() => editor?.chain().focus().toggleOrderedList().run()}
				title="Ordered List"
				{disabled}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line
						x1="10"
						y1="6"
						x2="21"
						y2="6"
					/><line
						x1="10"
						y1="12"
						x2="21"
						y2="12"
					/><line
						x1="10"
						y1="18"
						x2="21"
						y2="18"
					/>
					<text
						x="2"
						y="8"
						font-size="8"
						fill="currentColor"
						stroke="none"
						font-family="sans-serif">1</text
					>
					<text
						x="2"
						y="14"
						font-size="8"
						fill="currentColor"
						stroke="none"
						font-family="sans-serif">2</text
					>
					<text
						x="2"
						y="20"
						font-size="8"
						fill="currentColor"
						stroke="none"
						font-family="sans-serif">3</text
					>
				</svg>
			</button>
			<button
				type="button"
				class="btn btn-ghost btn-xs {editor.isActive('blockquote') ? 'btn-active' : ''}"
				onclick={() => editor?.chain().focus().toggleBlockquote().run()}
				title="Blockquote"
				{disabled}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2z"
					/>
					<path
						d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2z"
					/>
				</svg>
			</button>
			<button
				type="button"
				class="btn btn-ghost btn-xs {editor.isActive('codeBlock') ? 'btn-active' : ''}"
				onclick={() => editor?.chain().focus().toggleCodeBlock().run()}
				title="Code Block"
				{disabled}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect
						x="3"
						y="3"
						width="18"
						height="18"
						rx="2"
					/>
					<polyline points="9 8 5 12 9 16" /><polyline points="15 8 19 12 15 16" />
				</svg>
			</button>
			<button
				type="button"
				class="btn btn-ghost btn-xs"
				onclick={() => editor?.chain().focus().setHorizontalRule().run()}
				title="Horizontal Rule"
				{disabled}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
				>
					<line
						x1="3"
						y1="12"
						x2="21"
						y2="12"
					/>
				</svg>
			</button>

			<div class="divider divider-horizontal mx-0.5 w-0"></div>

			<!-- Link -->
			<button
				type="button"
				class="btn btn-ghost btn-xs {editor.isActive('link') ? 'btn-active' : ''}"
				onclick={set_link}
				title="Link"
				{disabled}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
					<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
				</svg>
			</button>
		</div>
	{/if}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={element}
		class="prose prose-sm min-h-48 max-w-none cursor-text px-2 [&>.ProseMirror]:min-h-48 [&>.ProseMirror]:py-2 [&>.ProseMirror]:outline-none"
		onclick={() => editor?.commands.focus()}
	></div>
</div>
