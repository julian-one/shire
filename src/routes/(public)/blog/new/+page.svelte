<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { PostStore } from '$lib/stores/post.svelte';
	import Editor from '$lib/components/Editor.svelte';

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
			goto('/blog');
		}
	}
</script>

<div class="pb-8 md:pb-12">
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
							d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/></svg
					>
					New Post
				</span>
			</li>
		</ul>
	</div>

	<h1 class="mt-2 text-xl font-black tracking-tight md:text-2xl">New Post</h1>

	<form
		onsubmit={handle_submit}
		class="mt-8"
	>
		<fieldset class="space-y-6">
			<legend class="sr-only">Details</legend>

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
			</div>

			<div>
				<span class="text-sm font-bold tracking-wide uppercase opacity-60">Content</span>
				<div class="mt-2">
					<Editor
						disabled={PostStore.loading}
						onchange={(json) => (content = json)}
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
