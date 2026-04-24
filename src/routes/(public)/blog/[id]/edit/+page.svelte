<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { PostStore } from '$lib/stores/post.svelte';
	import PostForm from '../../PostForm.svelte';

	let { data } = $props();

	async function handle_submit(title: string, content: string, is_public: boolean) {
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

		<PostForm
			initial_title={data.post.title}
			initial_content={data.post.content}
			initial_public={data.post.public}
			submit_label="Save"
			saving_label="Saving..."
			cancel_href="/blog/{data.post.post_id}"
			onsubmit={handle_submit}
		/>
	</div>
{/if}
