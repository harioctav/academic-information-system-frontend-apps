import { ApiResponse, TimeFormat } from "@/types/api";
import { Village } from "@/types/locations/village";

export interface StudentAddress {
	id: number;
	uuid: string;
	type: string;
	address: string;
	village: Village;
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export type StudentAddressResponse = ApiResponse<StudentAddress>;
export type StudentAddressCollectionResponse = ApiResponse<StudentAddress[]>;
