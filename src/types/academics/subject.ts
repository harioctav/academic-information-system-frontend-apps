import { ApiResponse, TimeFormat } from "@/types/api";

export interface Subject {
	id: number;
	uuid: string;
	code: string;
	name: string;
	course_credit: string;
	subject_status: string;
	exam_time: string;
	subject_note: string;
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export interface SubjectRequest {
	code: string;
	name: string;
	course_credit: string;
	subject_status: string;
	exam_time: string;
	notes?: string[];
}

export type SubjectResponse = ApiResponse<Subject>;
export type SubjectCollectionResponse = ApiResponse<Subject[]>;
