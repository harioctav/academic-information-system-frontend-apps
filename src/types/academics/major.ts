import { ApiResponse, TimeFormat } from "@/types/api";

export interface Major {
	id: number;
	uuid: string;
	code: string;
	name: string;
	degree: string;
	total_course_credit: number;
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export interface MajorRequest {
	code: number;
	name: string;
	degree: string;
}

export type MajorResponse = ApiResponse<Major>;
export type MajorCollectionResponse = ApiResponse<Major[]>;
