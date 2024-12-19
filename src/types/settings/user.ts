import { ApiResponse, TimeFormat } from "@/types/api";
import { Role } from "@/types/settings/role";

export interface User {
	id: number;
	uuid: string;
	name: string;
	email: string;
	status: number;
	phone: string;
	photo_profile_path: string | null;
	photo_url: string | null;
	last_activity: TimeFormat;
	roles: Role[];
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export interface UserRequest {
	name: string;
	email: string;
	phone?: string;
	roles: number;
	photo?: File;
}

export type UserResponse = ApiResponse<User>;
export type UserCollectionResponse = ApiResponse<User[]>;
