<script lang="ts">
	import moment from 'moment';
	import { goto } from '$app/navigation';
	import { PostStore } from '$lib/stores/post.svelte';
	import PostPreview from '../PostPreview.svelte';

	let { data } = $props();

	async function handle_delete() {
		if (!data.post) return;
		if (confirm('Are you sure you want to delete this post?')) {
			const success = await PostStore.delete_post(data.post.post_id);
			if (success) {
				goto('/blog');
			}
		}
	}
</script>

{#if !data.post}
	<div class="flex min-h-[60vh] items-center justify-center">
		<div class="card bg-base-100 border-base-content/10 border">
			<div class="card-body items-center text-center">
				<h2 class="card-title text-error">Error</h2>
				<p>Post not found</p>
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
					><span>{data.post.title.length > 30 ? `${data.post.title.substring(0, 30).trim()}...` : data.post.title}</span
					></li
				>
			</ul>
		</div>

		<h1 class="mt-4 text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">
			{data.post.title}
		</h1>

		<div class="mt-6">
			<p class="text-base-content/60 text-sm">
				Published{#if !data.user || data.user.user_id !== data.post.user_id}
					by {data.post.username}{/if} on {moment(data.post.created_at).format(
					'MMMM D, YYYY'
				)}{#if data.post.updated_at && data.post.updated_at !== data.post.created_at}
					· Last updated {moment(data.post.updated_at).format('MMMM D, YYYY')}
				{/if}
				{#if data.session}
					·
					{#if data.post.public}
						<span class="badge badge-success badge-sm">Public</span>
					{:else}
						<span class="badge badge-ghost badge-sm">Private</span>
					{/if}
				{/if}
			</p>
			{#if data.user?.user_id === data.post.user_id}
				<div class="mt-6 flex flex-row gap-2">
					<a
						href="/blog/{data.post.post_id}/edit"
						class="btn btn-soft">Edit Post</a
					>
					<button
						class="btn btn-ghost text-error"
						onclick={handle_delete}>Delete Post</button
					>
				</div>
			{/if}
		</div>

		<div class="mt-10">
			<PostPreview content={data.post.content} />
		</div>
	</div>
{/if}
