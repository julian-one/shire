<script lang="ts">
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { PostStore } from '$lib/stores/post.svelte';
	import PostEditor from './PostEditor.svelte';

	type Props = {
		initial_title?: string;
		initial_content?: string;
		initial_public?: boolean;
		submit_label: string;
		saving_label: string;
		cancel_href: string;
		onsubmit: (title: string, content: string, is_public: boolean) => void;
	};

	let {
		initial_title = '',
		initial_content = '',
		initial_public = false,
		submit_label,
		saving_label,
		cancel_href,
		onsubmit
	}: Props = $props();

	let title = $derived(initial_title);
	let content = $derived(initial_content);
	let is_public = $derived(initial_public);

	async function handle_submit(event: SubmitEvent) {
		event.preventDefault();
		onsubmit(title, content, is_public);
	}
</script>

<form
	onsubmit={handle_submit}
	class="mt-8"
>
	<fieldset class="space-y-6">
		<legend class="sr-only">Post Details</legend>

		<div>
			<label
				for="title"
				class="text-base-content/60 text-sm font-bold tracking-wide uppercase">Title</label
			>
			<input
				type="text"
				class="input validator mt-2 w-full text-xl font-bold"
				placeholder="Post title"
				id="title"
				bind:value={title}
				required
				disabled={PostStore.loading}
			/>
			<div class="validator-hint hidden">Required</div>
		</div>

		<div>
			<span class="text-base-content/60 text-sm font-bold tracking-wide uppercase">Content</span>
			<div class="mt-2">
				<PostEditor
					{content}
					disabled={PostStore.loading}
					onchange={(md) => (content = md)}
				/>
			</div>
		</div>

		<div class="flex items-center justify-between">
			<label
				for="visibility"
				class="text-base-content/60 text-sm font-bold tracking-wide uppercase">Visibility</label
			>
			<label class="label cursor-pointer gap-3">
				<span class="text-base-content/60 text-sm">{is_public ? 'Public' : 'Private'}</span>
				<input
					type="checkbox"
					class="toggle toggle-primary"
					id="visibility"
					bind:checked={is_public}
					onchange={() => {
						if (is_public) AlertStore.add('Public posts are visible to everyone', 'warning');
					}}
					disabled={PostStore.loading}
				/>
			</label>
		</div>

		<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
			<a
				href={cancel_href}
				class="btn btn-ghost">Cancel</a
			>
			<button
				class="btn btn-primary"
				type="submit"
				disabled={PostStore.loading}
			>
				{#if PostStore.loading}
					<span class="loading loading-spinner"></span>
					{saving_label}
				{:else}
					{submit_label}
				{/if}
			</button>
		</div>
	</fieldset>
</form>
