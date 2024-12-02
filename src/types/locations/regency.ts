import { Province } from "@/types/locations/province";
import { ApiResponse, TimeFormat } from "@/types/api";

export interface Regency {
	id: number;
	uuid: string;
	code: string;
	name: string;
	type: string;
	full_code: string;
	province: Province;
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export interface RegencyRequest {
	code: number;
	name: string;
	type: string;
	provinces: number;
}

export type RegencyResponse = ApiResponse<Regency>;
export type RegencyCollectionResponse = ApiResponse<Regency[]>;
