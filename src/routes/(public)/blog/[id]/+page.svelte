<script lang="ts">
	import moment from 'moment';
	import { goto } from '$app/navigation';
	import { PostStore } from '$lib/stores/post.svelte';
	import ReadOnlyEditor from '$lib/components/ReadOnlyEditor.svelte';

	let { data } = $props();

	async function handle_delete() {
		if (!data.post) return;
		const success = await PostStore.delete(data.post.post_id);
		if (success) {
			goto('/blog');
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
	<article>
		<div class="breadcrumbs text-sm">
			<ul>
				<li>
					<a href="/blog">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="h-4 w-4 stroke-current"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
							/></svg
						>
						Blog
					</a>
				</li>
				<li>
					<span class="inline-flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="h-4 w-4 stroke-current"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/></svg
						>
						{data.post.title.length > 30 ? `${data.post.title.substring(0, 30).trim()}...` : data.post.title}
					</span>
				</li>
			</ul>
		</div>

		<h1 class="mt-2 text-xl leading-tight font-black tracking-tight md:text-2xl">
			{data.post.title}
		</h1>

		<!-- eslint-disable svelte/no-useless-mustaches -->
		<p class="text-base-content/60 mt-2 text-sm">
			Published{#if !data.user || data.user.user_id !== data.post.user_id}{' '}by {data.post.username}{/if} on {moment(
				data.post.created_at
			).format('MMMM D, YYYY')}{#if data.post.updated_at && data.post.updated_at !== data.post.created_at}
				{' · '}Last updated {moment(data.post.updated_at).format('MMMM D, YYYY')}
			{/if}
			{#if data.session}
				{' · '}
				{#if data.post.public}
					<span class="badge badge-success badge-sm">Public</span>
				{:else}
					<span class="badge badge-ghost badge-sm">Private</span>
				{/if}
			{/if}
		</p>
		<!-- eslint-enable svelte/no-useless-mustaches -->

		<div class="py-2">
			<ReadOnlyEditor content={data.post.content} />
		</div>

		{#if data.user?.user_id === data.post.user_id}
			<div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
				<a
					href="/blog/{data.post.post_id}/edit"
					class="btn btn-outline gap-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
					Edit
				</a>
				<button
					class="btn btn-error btn-outline gap-2"
					onclick={handle_delete}
					disabled={PostStore.loading}
				>
					{#if PostStore.loading}
						<span class="loading loading-spinner loading-xs"></span>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
						Delete
					{/if}
				</button>
			</div>
		{/if}
	</article>
{/if}
