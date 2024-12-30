import { BaseService } from "@/lib/base.service";
import { Major } from "@/types/academics/major";
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
	// Subjects
}

export const academicOptionService = new AcademicOptionService();
