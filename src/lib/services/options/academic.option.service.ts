import { BaseService } from "@/lib/base.service";
import { Major } from "@/types/academics/major";
import { Student } from "@/types/academics/student";
import { Subject } from "@/types/academics/subject";
import { Params } from "@/types/api";

class AcademicOptionService extends BaseService {
	constructor() {
		super("/options/academics");
	}

	// Major
	getMajors = (params: Params) => {
		return this.get<Major[]>("/majors", params);
	};

	showMajor = (uuid: string) => {
		return this.get<Major>(`/majors/${uuid}`);
	};
	// Major

	// Subjects
	getSubjects = (params: Params) => {
		return this.get<Subject[]>("/subjects", params);
	};

	showSubject = (uuid: string) => {
		return this.get<Subject>(`/subjects/${uuid}`);
	};

	getRecommendationSubjects = (studentUuid?: string, params?: Params) => {
		return this.get<Subject[]>(`/subjects/${studentUuid}`, params);
	};
	// Subjects

	// Students
	getStudents = (params: Params) => {
		return this.get<Student[]>("/students", params);
	};

	showStudent = (uuid: string) => {
		return this.get<Student>(`/students/${uuid}`);
	};
	// Students
}

export const academicOptionService = new AcademicOptionService();
