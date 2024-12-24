export interface ApiResponse<T> {
	status: number;
	success: boolean;
	message: string;
	data: T;
	links?: {
		first: string;
		last: string;
		prev: string | null;
		next: string | null;
	};
	meta?: {
		current_page: number;
		from: number;
		last_page: number;
		links: Array<{
			url: string | null;
			label: string;
			active: boolean;
		}>;
		path: string;
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

export interface ApiError {
	message?: string;
	errors?: ValidationErrors;
}

export interface TimeFormat {
	human: string;
	machine: string;
	formatted: string;
}
