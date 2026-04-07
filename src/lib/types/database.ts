export type OrderBy = {
	column: string;
	order: 'asc' | 'desc';
};

export type PaginatedResponse<T> = {
	items: T[];
	total: number;
	limit: number;
	offset: number;
};
