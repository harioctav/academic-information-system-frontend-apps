import { ApiResponse, TimeFormat } from "@/types/api";
import { District } from "@/types/locations/district";

export interface Village {
	id: number;
	uuid: string;
	code: string;
	name: string;
	full_code: string;
	pos_code: string;
	district: District;
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export interface VillageRequest {
	code: number;
	name: string;
	pos_code: number;
	districts: number;
}

export type VillageResponse = ApiResponse<Village>;
export type VillageCollectionResponse = ApiResponse<Village[]>;
