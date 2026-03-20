import { Citadel } from '$lib/controllers/citadel';
import type { ListOptions, CreateRequest, UpdateRequest, ListablePost } from '$lib/types/post';

export class PostController {
	async create(request: CreateRequest): Promise<string> {
		const response = await Citadel.post('/posts', request);
		return response.data.post_id as string;
	}

	async list(options?: ListOptions): Promise<ListablePost[]> {
		const response = await Citadel.get('/posts', { params: options });
		return (response.data as ListablePost[]) ?? [];
	}

	async by_id(id: string): Promise<ListablePost> {
		const response = await Citadel.get(`/posts/${id}`);
		return response.data as ListablePost;
	}

	async update(id: string, request: UpdateRequest): Promise<void> {
		await Citadel.patch(`/posts/${id}`, request);
	}

	async delete_post(id: string): Promise<void> {
		await Citadel.delete(`/posts/${id}`);
	}
}
