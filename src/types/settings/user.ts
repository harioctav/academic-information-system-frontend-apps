import { ApiResponse, TimeFormat } from "@/types/api";
import { Role } from "@/types/settings/role";

export interface User {
	id: number;
	uuid: string;
	name: string;
	email: string;
	status: number;
	photo_profile_path: string | null;
	roles: Role[];
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export type UserResponse = ApiResponse<User>;
export type UserCollectionResponse = ApiResponse<User[]>;
