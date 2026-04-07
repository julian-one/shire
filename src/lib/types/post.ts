export type Post = {
	post_id: string;
	user_id: string;
	title: string;
	content: string;
	public: boolean;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date | null;
};

export type ListablePost = Post & {
	email: string;
	username: string;
};

export type CreateRequest = {
	user_id: string;
	title: string;
	content: string;
	public: boolean;
};

export type UpdateRequest = {
	title: string;
	content: string;
	public: boolean;
};

export type ListOptions = {
	search?: string;
	order_by?: string;
	public?: boolean;
	my_posts?: boolean | string;
	limit?: number;
	offset?: number;
};
