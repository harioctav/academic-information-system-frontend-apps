import { ApiResponse, TimeFormat } from "@/types/api";
import { Student } from "@/types/academics/student";
import { Subject } from "@/types/academics/subject";

export interface Grade {
	id: number;
	uuid: string;
	subject_id: number;
	student_id: number;
	grade: string;
	quality: string;
	exam_period: string;
	mutu: string;
	grade_note: string;
	student: Student;
	subject: Subject;
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export type GradeResponse = ApiResponse<Grade>;
export type GradeCollectionResponse = ApiResponse<Grade[]>;
