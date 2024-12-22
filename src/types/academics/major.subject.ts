import { Major } from "@/types/academics/major";
import { ApiResponse, TimeFormat } from "@/types/api";
import { Subject } from "@/types/academics/subject";

export interface MajorSubject {
	id: number;
	uuid: string;
	semester: number;
	major: Major;
	subject: Subject;
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export interface MajorSubjectRequest {
	subjects: string[];
	semester: number;
}

export type MajorSubjectResponse = ApiResponse<MajorSubject>;
export type MajorSubjectCollectionResponse = ApiResponse<MajorSubject[]>;
