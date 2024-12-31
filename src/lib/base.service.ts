import { TokenStorage } from "@/lib/utils/token-storage";
import { Params, ApiResponse } from "@/types/api";

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
export const CACHE_DURATION = 60000; // 1 minute

export const headers = () => ({
	"Content-Type": "application/json",
	Accept: "application/json",
	...(TokenStorage.getAccessToken() && {
		Authorization: `Bearer ${TokenStorage.getAccessToken()}`,
	}),
});

export const buildQueryParams = (params: Params) => {
	const queryParams = new URLSearchParams({
		page: params.page.toString(),
		per_page: params.perPage.toString(),
		sort_by: params.sortBy,
		sort_direction: params.sortDirection,
		...(params.search && { search: params.search }),
	});

	if (params.filters) {
		Object.entries(params.filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				queryParams.append(key, value.toString());
			}
		});
	}

	return queryParams.toString();
};

export class BaseService {
	protected cache = new Map();
	protected baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = `${BASE_API_URL}${baseUrl}`;
	}

	protected async silentFetch(
		url: string,
		options: RequestInit
	): Promise<Response> {
		try {
			return await fetch(url, options);
		} catch {
			return new Response(JSON.stringify({}), { status: 500 });
		}
	}

	protected async get<T>(
		endpoint: string,
		params?: Params
	): Promise<ApiResponse<T>> {
		try {
			if (params) {
				const cacheKey = JSON.stringify(params);
				const cachedData = this.cache.get(cacheKey);
				if (cachedData) return cachedData;

				const query = buildQueryParams(params);
				endpoint = `${endpoint}?${query}`;
			}

			const response = await this.silentFetch(`${this.baseUrl}${endpoint}`, {
				headers: headers(),
				credentials: "include",
			});

			const result = await response.json().catch(() => ({}));

			if (response.status === 403) {
				return {
					status: response.status,
					success: false,
					message:
						result.message ||
						"You don't have permission to access this resource",
					data: {} as T,
				};
			}

			if (!response.ok) {
				return {
					status: response.status,
					success: false,
					message: result.message || `Failed to fetch data from ${endpoint}`,
					data: {} as T,
				};
			}

			if (params) {
				const cacheKey = JSON.stringify(params);
				this.cache.set(cacheKey, result);
				setTimeout(() => this.cache.delete(cacheKey), CACHE_DURATION);
			}

			return {
				...result,
				success: true,
				status: response.status,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An unexpected error occurred";
			return {
				status: 500,
				success: false,
				message: errorMessage,
				data: {} as T,
			};
		}
	}

	protected async post<T, R = { message: string }>(
		endpoint: string,
		body: T
	): Promise<ApiResponse<R>> {
		try {
			const response = await this.silentFetch(`${this.baseUrl}${endpoint}`, {
				method: "POST",
				headers: headers(),
				credentials: "include",
				body: JSON.stringify(body),
			});

			const result = await response.json();

			// Add this block to handle validation errors (422 status)
			if (response.status === 422) {
				throw {
					message: result.message,
					errors: result.errors,
				};
			}

			if (!response.ok) {
				throw {
					message: result.message || "Request failed",
					errors: result.errors,
				};
			}

			this.clearListCache();
			return {
				...result,
				success: true,
				status: response.status,
			};
		} catch (error) {
			throw error;
		}
	}

	protected async put<T, R = { message: string }>(
		endpoint: string,
		body: T
	): Promise<ApiResponse<R>> {
		try {
			const response = await this.silentFetch(`${this.baseUrl}${endpoint}`, {
				method: "PUT",
				headers: headers(),
				credentials: "include",
				body: JSON.stringify(body),
			});

			const result = await response.json();

			if (response.status === 422) {
				throw {
					message: result.message,
					errors: result.errors,
				};
			}

			if (!response.ok) {
				throw {
					message: result.message || "Request failed",
					errors: result.errors,
				};
			}

			this.clearListCache();
			return {
				...result,
				success: true,
				status: response.status,
			};
		} catch (error) {
			throw error;
		}
	}

	protected async delete<T, R>(
		endpoint: string,
		body?: T
	): Promise<ApiResponse<R>> {
		try {
			const response = await this.silentFetch(`${this.baseUrl}${endpoint}`, {
				method: "DELETE",
				headers: headers(),
				credentials: "include",
				...(body && { body: JSON.stringify(body) }),
			});

			const result = await response.json().catch(() => ({}));

			if (response.status === 403) {
				return {
					status: response.status,
					success: false,
					message:
						result.message ||
						"You don't have permission to perform this action",
					data: {} as R,
				};
			}

			if (!response.ok) {
				return {
					status: response.status,
					success: false,
					message: result.message || "Request failed",
					data: {} as R,
				};
			}

			this.clearListCache();
			return {
				...result,
				success: true,
				status: response.status,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An unexpected error occurred";
			return {
				status: 500,
				success: false,
				message: errorMessage,
				data: {} as R,
			};
		}
	}

	protected clearListCache() {
		Array.from(this.cache.keys())
			.filter((key) => key.startsWith('{"page":'))
			.forEach((key) => this.cache.delete(key));
	}
}
