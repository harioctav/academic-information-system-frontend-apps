import { ApiResponse, TimeFormat } from "@/types/api";

export interface Role {
	id: number;
	uuid: string;
	name: string;
	guard_name: string;
	permissions: string[];
	permissions_total: number;
	users_total: number;
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export interface RoleRequest {
	name: string;
	permissions?: string[];
}

export interface ValidationErrors {
	name?: string[];
	permissions?: string[];
}

export type RoleResponse = ApiResponse<Role>;
export type RoleCollectionResponse = ApiResponse<Role[]>;
