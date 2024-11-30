import { ApiResponse, TimeFormat } from "@/types/api";

export interface Permission {
	id: number;
	uuid: string;
	name: string;
	guard_name: string;
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export type PermissionResponse = ApiResponse<Permission>;
export type PermissionCollectionResponse = ApiResponse<Permission[]>;
