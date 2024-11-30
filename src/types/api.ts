// Generic API response interface
export interface ApiResponse<T> {
	data: T;
	links?: {
		first: string;
		last: string;
		prev: string;
		next: string;
	};
	meta?: {
		current_page: number;
		from: number;
		last_page: number;
		links: [
			{
				url: string;
				label: string;
				active: boolean;
			}
		];
		per_page: number;
		to: number;
		total: number;
	};
}

export interface Params {
	page: number;
	perPage: number;
	sortBy: string;
	sortDirection: "asc" | "desc";
	search?: string;
	type?: string;
	filters?: {
		[key: string]: string | number;
	};
}

export interface ValidationErrors {
	[key: string]: string[];
}

export interface TimeFormat {
	human: string;
	machine: string;
	formatted: string;
}
