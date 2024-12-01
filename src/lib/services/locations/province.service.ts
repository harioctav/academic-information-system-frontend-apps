import { Params } from "@/types/api";
import {
	ProvinceCollectionResponse,
	ProvinceResponse,
} from "@/types/locations/province";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
const getToken = () => document.cookie.split("token=")[1]?.split(";")[0];

const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
	Authorization: `Bearer ${getToken()}`,
};

export const provinceService = {
	// Display a listing of the resource.
	getProvinces: async (params: Params) => {
		const queryString = new URLSearchParams({
			page: params.page.toString(),
			per_page: params.perPage.toString(),
			sort_by: params.sortBy,
			sort_direction: params.sortDirection,
			...(params.search && { search: params.search }),
		}).toString();

		const response = await fetch(
			`${BASE_API_URL}/locations/provinces?${queryString}`,
			{
				headers,
				credentials: "include",
			}
		);

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw new Error("Failed to fetch provinces");
		}

		return response.json() as Promise<ProvinceCollectionResponse>;
	},

	// Display the specified resource.
	showProvince: async (uuid: string) => {
		const response = await fetch(
			`${BASE_API_URL}/locations/provinces/${uuid}`,
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

		return response.json() as Promise<ProvinceResponse>;
	},

	// Remove the specified resource from storage.
	deleteProvince: async (uuid: string) => {
		const response = await fetch(
			`${BASE_API_URL}/locations/provinces/${uuid}`,
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
	bulkDeleteProvinces: async (ids: string[]) => {
		const response = await fetch(
			`${BASE_API_URL}/locations/provinces/bulk-delete`,
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
