import { Params } from "@/types/api";
import {
	RegencyCollectionResponse,
	RegencyRequest,
	RegencyResponse,
} from "@/types/locations/regency";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
const getToken = () => document.cookie.split("token=")[1]?.split(";")[0];

const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
	Authorization: `Bearer ${getToken()}`,
};

export const regencyService = {
	// Display a listing of the resource.
	getRegencies: async (params: Params) => {
		const queryString = new URLSearchParams({
			page: params.page.toString(),
			per_page: params.perPage.toString(),
			sort_by: params.sortBy,
			sort_direction: params.sortDirection,
			...(params.search && { search: params.search }),
		}).toString();

		const response = await fetch(
			`${BASE_API_URL}/locations/regencies?${queryString}`,
			{
				headers,
				credentials: "include",
			}
		);

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw new Error("Failed to fetch regencies");
		}

		return response.json() as Promise<RegencyCollectionResponse>;
	},

	// Store a newly created resource in storage.
	storeRegency: async (request: RegencyRequest) => {
		const response = await fetch(`${BASE_API_URL}/locations/regencies`, {
			method: "POST",
			headers,
			credentials: "include",
			body: JSON.stringify(request),
		});

		const result = await response.json();

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw result;
		}

		return result;
	},

	// Display the specified resource.
	showRegency: async (uuid: string) => {
		const response = await fetch(
			`${BASE_API_URL}/locations/regencies/${uuid}`,
			{
				headers,
				credentials: "include",
			}
		);

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw new Error("Failed to fetch province");
		}

		return response.json() as Promise<RegencyResponse>;
	},

	// Update the specified resource in storage.
	updateRegency: async (uuid: string, request: RegencyRequest) => {
		const response = await fetch(
			`${BASE_API_URL}/locations/regencies/${uuid}`,
			{
				method: "PUT",
				headers,
				credentials: "include",
				body: JSON.stringify(request),
			}
		);

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		const result = await response.json();

		if (!response.ok) {
			throw result;
		}

		return result;
	},

	// Remove the specified resource from storage.
	deleteRegency: async (uuid: string) => {
		const response = await fetch(
			`${BASE_API_URL}/locations/regencies/${uuid}`,
			{
				method: "DELETE",
				headers,
				credentials: "include",
			}
		);

		const result = await response.json();

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw result;
		}

		return result;
	},

	// Remove multiple resources from storage.
	bulkDeleteRegencies: async (ids: string[]) => {
		const response = await fetch(
			`${BASE_API_URL}/locations/regencies/bulk-delete`,
			{
				method: "DELETE",
				headers,
				credentials: "include",
				body: JSON.stringify({ ids }),
			}
		);

		const result = await response.json();

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw result;
		}

		return result;
	},
};
