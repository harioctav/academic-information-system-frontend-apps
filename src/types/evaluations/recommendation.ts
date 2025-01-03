import { ApiResponse, TimeFormat } from "@/types/api";
import { Student } from "@/types/academics/student";
import { Subject } from "@/types/academics/subject";

export interface Recommendation {
	id: number;
	uuid: string;
	subject_id: number;
	student_id: number;
	semester: number;
	exam_period: string;
	recommendation_note: string;
	student: Student;
	subject: Subject;
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export interface RecommendationRequest {
	student_id: number;
	subjects: string[];
	exam_period: string;
	recommendation_note: string;
}

export type RecommendationResponse = ApiResponse<Recommendation>;
export type RecommendationCollectionResponse = ApiResponse<Recommendation[]>;
