import { ApiResponse, TimeFormat } from "@/types/api";
import { Grade } from "@/types/evaluations/grade";
import { Recommendation } from "@/types/evaluations/recommendation";

export interface Subject {
	id: number;
	uuid: string;
	code: string;
	name: string;
	course_credit: string;
	subject_status: string;
	exam_time: string;
	subject_note: string;
	semester?: number;
	grades?: Grade[];
	recommendations?: Recommendation[];
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
