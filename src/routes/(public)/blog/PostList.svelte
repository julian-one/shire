<script lang="ts">
	import moment from 'moment';
	import SortHeader from '$lib/components/SortHeader.svelte';
	import type { ListablePost } from '$lib/types/post';
	import type { Session } from '$lib/types/session';

	type Props = {
		posts: ListablePost[];
		session?: Session;
		has_active_filters: boolean;
		order_by: string;
		on_sort: (value: string) => void;
	};

	let { posts, session, has_active_filters, order_by, on_sort }: Props = $props();
</script>

{#if posts.length === 0}
	<div
		class="border-base-content/10 mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
	>
		<div class="bg-base-200 rounded-full p-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="text-base-content/60 h-8 w-8"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
				/>
			</svg>
		</div>
		<h3 class="mt-4 text-lg font-bold">No posts found</h3>
		<p class="text-base-content/60 mt-1 text-sm">
			{#if has_active_filters}
				Try adjusting your filters.
			{:else if session}
				Start sharing your thoughts with the community.
			{:else}
				Want to share your thoughts? <a
					href="/login"
					class="link">Log in</a
				> to create your first post.
			{/if}
		</p>
	</div>
{:else}
	<div class="rounded-box border-base-content/10 bg-base-100 overflow-x-auto border">
		<table class="table">
			<thead>
				<tr>
					<SortHeader
						label="Title"
						field="title"
						{order_by}
						{on_sort}
					/>
					<th class="hidden sm:table-cell">Author</th>
					{#if session}
						<th class="hidden sm:table-cell">Status</th>
					{/if}
					<SortHeader
						label="Date"
						field="created_at"
						{order_by}
						{on_sort}
					/>
				</tr>
			</thead>
			<tbody>
				{#each posts as post (post.post_id)}
					<tr>
						<td>
							<a
								href="/blog/{post.post_id}"
								class="link"
							>
								{post.title.length > 60 ? `${post.title.substring(0, 60).trim()}...` : post.title.trim()}
							</a>
						</td>
						<td class="text-base-content/60 hidden sm:table-cell">{post.username}</td>
						{#if session}
							<td class="hidden sm:table-cell">
								{#if post.public}
									<span class="badge badge-success badge-sm">Public</span>
								{:else}
									<span class="badge badge-ghost badge-sm">Private</span>
								{/if}
							</td>
						{/if}
						<td class="text-base-content/60 text-sm">
							{moment(post.created_at).format('MMM D, YYYY')}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
