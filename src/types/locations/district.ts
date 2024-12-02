import { ApiResponse, TimeFormat } from "@/types/api";
import { Regency } from "@/types/locations/regency";

export interface District {
	id: number;
	uuid: string;
	code: string;
	name: string;
	full_code: string;
	regency: Regency;
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export interface DistrictRequest {
	code: string;
	name: string;
	regencies: number;
}

export type DistrictResponse = ApiResponse<District>;
export type DistrictCollectionResponse = ApiResponse<District[]>;
