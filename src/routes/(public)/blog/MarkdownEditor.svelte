<script lang="ts">
	import { tick } from 'svelte';
	import { render_markdown } from './markdown';

	type Props = {
		content?: string;
		disabled?: boolean;
		onchange?: (markdown: string) => void;
	};

	let { content = '', disabled = false, onchange }: Props = $props();

	let active_tab = $state<'write' | 'preview'>('write');
	let markdown = $derived(content);
	let textarea_ref: HTMLTextAreaElement | undefined = $state();

	let preview_html = $derived(active_tab === 'preview' ? render_markdown(markdown) : '');

	function handle_input() {
		onchange?.(markdown);
	}

	async function insert_wrap(prefix: string, suffix: string, placeholder: string) {
		if (!textarea_ref) return;
		const start = textarea_ref.selectionStart;
		const end = textarea_ref.selectionEnd;
		const selected = markdown.substring(start, end);
		const text = selected || placeholder;
		const before = markdown.substring(0, start);
		const after = markdown.substring(end);

		markdown = before + prefix + text + suffix + after;
		onchange?.(markdown);

		await tick();
		if (selected) {
			textarea_ref.selectionStart = start + prefix.length;
			textarea_ref.selectionEnd = start + prefix.length + text.length;
		} else {
			textarea_ref.selectionStart = start + prefix.length;
			textarea_ref.selectionEnd = start + prefix.length + placeholder.length;
		}
		textarea_ref.focus();
	}

	async function insert_line_prefix(prefix: string) {
		if (!textarea_ref) return;
		const start = textarea_ref.selectionStart;
		const line_start = markdown.lastIndexOf('\n', start - 1) + 1;
		const before = markdown.substring(0, line_start);
		const after = markdown.substring(line_start);

		markdown = before + prefix + after;
		onchange?.(markdown);

		await tick();
		textarea_ref.selectionStart = start + prefix.length;
		textarea_ref.selectionEnd = start + prefix.length;
		textarea_ref.focus();
	}

	async function handle_keydown(e: KeyboardEvent) {
		if (e.key === 'Tab' && textarea_ref) {
			e.preventDefault();
			const start = textarea_ref.selectionStart;
			const end = textarea_ref.selectionEnd;
			const before = markdown.substring(0, start);
			const after = markdown.substring(end);
			markdown = before + '\t' + after;
			onchange?.(markdown);
			await tick();
			textarea_ref.selectionStart = start + 1;
			textarea_ref.selectionEnd = start + 1;
			return;
		}
		if (!e.ctrlKey && !e.metaKey) return;
		switch (e.key) {
			case 'b':
				e.preventDefault();
				insert_wrap('**', '**', 'bold text');
				break;
			case 'i':
				e.preventDefault();
				insert_wrap('_', '_', 'italic text');
				break;
			case 'k':
				e.preventDefault();
				insert_wrap('[', '](url)', 'link text');
				break;
		}
	}
</script>

<div class="rounded-box border-base-content/20 border">
	<div
		role="tablist"
		class="tabs tabs-lift"
	>
		<button
			type="button"
			role="tab"
			class="tab {active_tab === 'write' ? 'tab-active' : ''}"
			onclick={() => (active_tab = 'write')}
		>
			Write
		</button>
		<button
			type="button"
			role="tab"
			class="tab {active_tab === 'preview' ? 'tab-active' : ''}"
			onclick={() => (active_tab = 'preview')}
		>
			Preview
		</button>
	</div>

	{#if active_tab === 'write'}
		<div class="border-base-content/20 flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
			<div class="tooltip tooltip-bottom">
				<div class="tooltip-content text-xs">Heading 1</div>
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					onclick={() => insert_line_prefix('# ')}
					{disabled}
				>
					H1
				</button>
			</div>
			<div class="tooltip tooltip-bottom">
				<div class="tooltip-content text-xs">Heading 2</div>
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					onclick={() => insert_line_prefix('## ')}
					{disabled}
				>
					H2
				</button>
			</div>
			<div class="tooltip tooltip-bottom">
				<div class="tooltip-content text-xs">Heading 3</div>
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					onclick={() => insert_line_prefix('### ')}
					{disabled}
				>
					H3
				</button>
			</div>

			<div class="divider divider-horizontal mx-0.5 w-0"></div>

			<div class="tooltip tooltip-bottom">
				<div class="tooltip-content text-xs">Bold</div>
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					aria-label="Bold"
					onclick={() => insert_wrap('**', '**', 'bold text')}
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
			</div>
			<div class="tooltip tooltip-bottom">
				<div class="tooltip-content text-xs">Italic</div>
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					aria-label="Italic"
					onclick={() => insert_wrap('_', '_', 'italic text')}
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
			</div>
			<div class="tooltip tooltip-bottom">
				<div class="tooltip-content text-xs">Inline Code</div>
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					aria-label="Inline Code"
					onclick={() => insert_wrap('`', '`', 'code')}
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
			</div>

			<div class="divider divider-horizontal mx-0.5 w-0"></div>

			<div class="tooltip tooltip-bottom">
				<div class="tooltip-content text-xs">Link</div>
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					aria-label="Link"
					onclick={() => insert_wrap('[', '](url)', 'link text')}
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
			<div class="tooltip tooltip-bottom">
				<div class="tooltip-content text-xs">Blockquote</div>
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					aria-label="Blockquote"
					onclick={() => insert_line_prefix('> ')}
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
			</div>
			<div class="tooltip tooltip-bottom">
				<div class="tooltip-content text-xs">Code Block</div>
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					aria-label="Code Block"
					onclick={() => insert_wrap('\n```\n', '\n```\n', 'code block')}
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
			</div>

			<div class="divider divider-horizontal mx-0.5 w-0"></div>

			<div class="tooltip tooltip-bottom">
				<div class="tooltip-content text-xs">Unordered List</div>
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					aria-label="Unordered List"
					onclick={() => insert_line_prefix('- ')}
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
			</div>
			<div class="tooltip tooltip-bottom">
				<div class="tooltip-content text-xs">Ordered List</div>
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					onclick={() => insert_line_prefix('1. ')}
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
							stroke="none">1</text
						>
						<text
							x="2"
							y="14"
							font-size="8"
							fill="currentColor"
							stroke="none">2</text
						>
						<text
							x="2"
							y="20"
							font-size="8"
							fill="currentColor"
							stroke="none">3</text
						>
					</svg>
				</button>
			</div>
			<div class="tooltip tooltip-bottom">
				<div class="tooltip-content text-xs">Task List</div>
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					aria-label="Task List"
					onclick={() => insert_line_prefix('- [ ] ')}
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
						<rect
							x="3"
							y="5"
							width="6"
							height="6"
							rx="1"
						/>
						<line
							x1="13"
							y1="8"
							x2="21"
							y2="8"
						/>
						<path d="m3 17 2 2 4-4" />
						<line
							x1="13"
							y1="18"
							x2="21"
							y2="18"
						/>
					</svg>
				</button>
			</div>
		</div>

		<textarea
			bind:this={textarea_ref}
			bind:value={markdown}
			oninput={handle_input}
			onkeydown={handle_keydown}
			class="bg-base-100 text-base-content min-h-48 w-full resize-y px-4 py-3 font-mono text-sm outline-none"
			placeholder="Write your content here..."
			{disabled}
		></textarea>
	{:else}
		<div class="min-h-48 px-4 py-3">
			{#if markdown}
				<div class="prose prose-sm max-w-none">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- sanitized by DOMPurify -->
					{@html preview_html}
				</div>
			{:else}
				<p class="text-base-content/40 italic">Nothing to preview</p>
			{/if}
		</div>
	{/if}
</div>
