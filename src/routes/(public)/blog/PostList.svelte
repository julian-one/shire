<script lang="ts">
	import moment from 'moment';
	import type { ListablePost } from '$lib/types/post';
	import type { Session } from '$lib/types/session';
	import type { User } from '$lib/types/user';

	type Props = {
		posts: ListablePost[];
		session?: Session;
		user?: User;
	};

	let { posts, session, user }: Props = $props();

	let my_posts = $derived(user ? posts.filter((p) => p.user_id === user.user_id) : []);
	let public_posts = $derived(user ? posts.filter((p) => p.user_id !== user.user_id) : posts);
</script>

{#snippet postGrid(items: ListablePost[])}
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each items as post (post.post_id)}
			<a
				href="/blog/{post.post_id}"
				class="card bg-base-100 border-base-content/10 border"
			>
				<div class="card-body flex flex-col">
					{#if session}
						<div class="flex items-center justify-end text-xs opacity-50">
							{#if post.public}
								<span class="badge badge-success badge-xs">Public</span>
							{:else}
								<span class="badge badge-ghost badge-xs">Private</span>
							{/if}
						</div>
					{/if}
					<h2 class="card-title text-lg md:text-xl">
						{post.title.length > 30 ? `${post.title.substring(0, 30).trim()}...` : post.title.trim()}
					</h2>
					<p class="mt-auto pt-4 text-xs opacity-50">
						<!-- eslint-disable svelte/no-useless-mustaches -->
						Published{#if !user || post.user_id !== user.user_id}{' '}by {post.username}{/if} on {moment(
							post.created_at
						).format('MMM D, YYYY')}{#if post.updated_at && post.updated_at !== post.created_at}
							{' · '}Last updated {moment(post.updated_at).format('MMM D, YYYY')}
						{/if}
						<!-- eslint-enable svelte/no-useless-mustaches -->
					</p>
				</div>
			</a>
		{/each}
	</div>
{/snippet}

{#if posts.length === 0}
	<div class="flex flex-col items-center py-20 text-center">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-16 w-16 opacity-20"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
				d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
			/>
		</svg>
		<p class="mt-4 text-lg opacity-60">No posts found</p>
		{#if session}
			<p class="mt-1 text-sm opacity-40">Start sharing your thoughts with the community.</p>
			<a
				href="/blog/new"
				class="btn btn-primary mt-6">Write your first post</a
			>
		{:else}
			<p class="mt-1 text-sm opacity-40">
				Want to share your thoughts? <a
					href="/login"
					class="link">Log in</a
				> to create your first post.
			</p>
		{/if}
	</div>
{:else if user}
	<div class="space-y-8">
		{#if my_posts.length > 0}
			<section>
				<div class="mb-4 flex items-center gap-2">
					<h2 class="text-lg font-bold md:text-xl">My Posts</h2>
					<span class="badge badge-neutral badge-sm">{my_posts.length}</span>
				</div>
				{@render postGrid(my_posts)}
			</section>
		{/if}

		{#if public_posts.length > 0}
			<section>
				<div class="mb-4 flex items-center gap-2">
					<h2 class="text-lg font-bold md:text-xl">Public Posts</h2>
					<span class="badge badge-neutral badge-sm">{public_posts.length}</span>
				</div>
				{@render postGrid(public_posts)}
			</section>
		{/if}
	</div>
{:else}
	{@render postGrid(posts)}
{/if}
