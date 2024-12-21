import { BaseService } from "@/lib/base.service";
import { Subject, SubjectRequest } from "@/types/academics/subject";
import { Params } from "@/types/api";

class SubjectService extends BaseService {
	constructor() {
		super("/academics/subjects");
	}

	getSubjects = (params: Params) => {
		return this.get<Subject[]>("", params);
	};

	storeSubject = (request: SubjectRequest) => {
		return this.post<SubjectRequest, Subject>("", request);
	};

	showSubject = (uuid: string) => {
		return this.get<Subject>(`/${uuid}`);
	};

	updateSubject = (uuid: string, request: SubjectRequest) => {
		return this.put<SubjectRequest, Subject>(`/${uuid}`, request);
	};

	deleteSubject = (uuid: string) => {
		return this.delete<void, Subject>(`/${uuid}`);
	};

	bulkDeleteSubjects = (ids: string[]) => {
		return this.delete<{ ids: string[] }, Subject>("/bulk-delete", { ids });
	};
}

export const subjectService = new SubjectService();
