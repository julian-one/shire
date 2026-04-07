<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { PostStore } from '$lib/stores/post.svelte';
	import PostEditor from '../PostEditor.svelte';

	let title = $state('');
	let content = $state('');
	let is_public = $state(false);

	async function handle_submit(event: SubmitEvent) {
		event.preventDefault();

		const user_id = page.data.user?.user_id;
		if (!user_id) {
			AlertStore.add('You must be logged in to create a post', 'error');
			return;
		}

		const post_id = await PostStore.create(user_id, title, content, is_public);
		if (post_id) {
			await invalidateAll();
			goto('/blog');
		}
	}
</script>

<div class="pb-8 md:pb-12">
	<div class="breadcrumbs text-sm">
		<ul>
			<li><a href="/blog">Blog</a></li>
			<li><span>New Post</span></li>
		</ul>
	</div>

	<h1 class="mt-2 text-3xl font-black tracking-tight md:text-4xl">New Post</h1>

	<form
		onsubmit={handle_submit}
		class="mt-8"
	>
		<fieldset class="space-y-6">
			<legend class="sr-only">Details</legend>

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
					href="/blog"
					class="btn btn-ghost">Cancel</a
				>
				<button
					class="btn btn-primary"
					type="submit"
					disabled={PostStore.loading}
				>
					{#if PostStore.loading}
						<span class="loading loading-spinner"></span>
						Publishing...
					{:else}
						Publish
					{/if}
				</button>
			</div>
		</fieldset>
	</form>
</div>
