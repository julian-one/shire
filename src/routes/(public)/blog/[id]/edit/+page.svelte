<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { PostStore } from '$lib/stores/post.svelte';
	import MarkdownEditor from '../../MarkdownEditor.svelte';

	let { data } = $props();

	let title = $derived(data.post?.title ?? '');
	let content = $derived(data.post?.content ?? '');
	let is_public = $derived(data.post?.public ?? false);

	async function handle_submit(event: SubmitEvent) {
		event.preventDefault();

		if (!data.post) return;

		const success = await PostStore.update(data.post.post_id, title, content, is_public);
		if (success) {
			await invalidateAll();
			goto(`/blog/${data.post.post_id}`);
		}
	}
</script>

{#if data.error || !data.post}
	<div class="flex min-h-[60vh] items-center justify-center">
		<div class="card bg-base-100 border-base-content/10 border">
			<div class="card-body items-center text-center">
				<h2 class="card-title text-error">Error</h2>
				<p>{data.error || 'Post not found'}</p>
				<a
					href="/blog"
					class="btn btn-primary btn-sm mt-4">Back to Blog</a
				>
			</div>
		</div>
	</div>
{:else}
	<div class="pb-8 md:pb-12">
		<div class="breadcrumbs text-sm">
			<ul>
				<li><a href="/blog">Blog</a></li>
				<li
					><a href="/blog/{data.post.post_id}"
						>{data.post.title.length > 30 ? `${data.post.title.substring(0, 30).trim()}...` : data.post.title}</a
					></li
				>
				<li><span>Edit</span></li>
			</ul>
		</div>

		<h1 class="mt-2 text-3xl font-black tracking-tight md:text-4xl">Edit Post</h1>

		<form
			onsubmit={handle_submit}
			class="mt-8"
		>
			<fieldset class="space-y-6">
				<legend class="sr-only">Post Details</legend>

				<div>
					<label
						for="title"
						class="text-sm font-bold tracking-wide uppercase opacity-60">Title</label
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
					<span class="text-sm font-bold tracking-wide uppercase opacity-60">Content</span>
					<div class="mt-2">
						<MarkdownEditor
							{content}
							disabled={PostStore.loading}
							onchange={(md) => (content = md)}
						/>
					</div>
				</div>

				<div class="flex items-center justify-between">
					<label
						for="visibility"
						class="text-sm font-bold tracking-wide uppercase opacity-60">Visibility</label
					>
					<label class="label cursor-pointer gap-3">
						<span class="text-sm opacity-60">{is_public ? 'Public' : 'Private'}</span>
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
						href="/blog/{data.post.post_id}"
						class="btn btn-ghost">Cancel</a
					>
					<button
						class="btn btn-primary"
						type="submit"
						disabled={PostStore.loading}
					>
						{#if PostStore.loading}
							<span class="loading loading-spinner"></span>
							Saving...
						{:else}
							Save
						{/if}
					</button>
				</div>
			</fieldset>
		</form>
	</div>
{/if}
