import { Citadel } from '$lib/controllers/citadel';
import type { ListOptions, CreateRequest, UpdateRequest, ListablePost } from '$lib/types/post';

export class PostController {
	async Create(request: CreateRequest): Promise<string> {
		const response = await Citadel.post('/posts', request);
		return response.data.post_id as string;
	}

	async List(options?: ListOptions): Promise<ListablePost[]> {
		const response = await Citadel.get('/posts', { params: options });
		return (response.data as ListablePost[]) ?? [];
	}

	async ById(id: string): Promise<ListablePost> {
		const response = await Citadel.get(`/posts/${id}`);
		return response.data as ListablePost;
	}

	async Update(id: string, request: UpdateRequest): Promise<void> {
		await Citadel.patch(`/posts/${id}`, request);
	}

	async Delete(id: string): Promise<void> {
		await Citadel.delete(`/posts/${id}`);
	}
}
