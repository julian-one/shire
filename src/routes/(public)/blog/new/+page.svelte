<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { PostStore } from '$lib/stores/post.svelte';
	import PostForm from '../PostForm.svelte';

	async function handle_submit(title: string, content: string, is_public: boolean) {
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

	<PostForm
		submit_label="Publish"
		saving_label="Publishing..."
		cancel_href="/blog"
		onsubmit={handle_submit}
	/>
</div>
