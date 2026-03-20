import { PostController } from '$lib/controllers/post';
import { AlertStore } from '$lib/stores/alert.svelte';

class SinglePost {
	private post_controller = new PostController();

	loading: boolean = $state(false);

	async create(user_id: string, title: string, content: string, is_public: boolean): Promise<string | null> {
		this.loading = true;
		try {
			const post_id = await this.post_controller.create({ user_id, title, content, public: is_public });
			AlertStore.add('Post created successfully', 'success');
			return post_id;
		} catch {
			AlertStore.add('Failed to create post', 'error');
			return null;
		} finally {
			this.loading = false;
		}
	}

	async update(id: string, title: string, content: string, is_public: boolean): Promise<boolean> {
		this.loading = true;
		try {
			await this.post_controller.update(id, { title, content, public: is_public });
			AlertStore.add('Post updated successfully', 'success');
			return true;
		} catch {
			AlertStore.add('Failed to update post', 'error');
			return false;
		} finally {
			this.loading = false;
		}
	}

	async delete(id: string): Promise<boolean> {
		this.loading = true;
		try {
			await this.post_controller.delete_post(id);
			AlertStore.add('Post deleted successfully', 'success');
			return true;
		} catch {
			AlertStore.add('Failed to delete post', 'error');
			return false;
		} finally {
			this.loading = false;
		}
	}
}

export const PostStore = new SinglePost();
