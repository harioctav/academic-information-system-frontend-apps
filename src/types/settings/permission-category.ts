import { ApiResponse, TimeFormat } from "@/types/api";
import { Permission } from "@/types/settings/permission";

export interface PermissionCategory {
	id: number;
	uuid: string;
	name: string;
	permissions: Permission[];
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export type PermissionCategoryResponse = ApiResponse<PermissionCategory>;
export type PermissionCategoryCollectionResponse = ApiResponse<
	PermissionCategory[]
>;
