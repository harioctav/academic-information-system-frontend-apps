import { ApiResponse, TimeFormat } from "@/types/api";

export interface Province {
	id: number;
	uuid: string;
	code: string;
	name: string;
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export interface ProvinceRequest {
	code: number;
	name: string;
}

export type ProvinceResponse = ApiResponse<Province>;
export type ProvinceCollectionResponse = ApiResponse<Province[]>;
