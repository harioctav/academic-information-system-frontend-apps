import { BaseService } from "@/lib/base.service";
import {
	MajorSubject,
	MajorSubjectRequest,
} from "@/types/academics/major.subject";
import { Subject } from "@/types/academics/subject";
import { Params } from "@/types/api";

class MajorSubjectService extends BaseService {
	constructor() {
		super("/academics/majors");
	}

	getMajorSubjects = (majorUuid: string, params: Params) => {
		return this.get<MajorSubject[]>(`/${majorUuid}/subjects`, params);
	};

	getAvailableMajorSubjects = (majorUuid: string, params: Params) => {
		return this.get<Subject[]>(`/${majorUuid}/subjects/conditions`, params);
	};

	storeMajorSubject = (majorUuid: string, request: MajorSubjectRequest) => {
		return this.post<MajorSubjectRequest>(`/${majorUuid}/subjects`, request);
	};

	updateMajorSubject = (
		majorUuid: string,
		majorSubjectUuid: string,
		request: MajorSubjectRequest
	) => {
		return this.put<MajorSubjectRequest, MajorSubject>(
			`/${majorUuid}/subjects/${majorSubjectUuid}`,
			request
		);
	};

	deleteMajorSubject = (majorUuid: string, majorSubjectUuid: string) => {
		return this.delete<void, MajorSubject>(
			`/${majorUuid}/subjects/${majorSubjectUuid}`
		);
	};

	bulkDeleteMajorSubjects = (ids: string[], majorUuid: string) => {
		return this.delete<{ ids: string[] }, MajorSubject>(
			`/${majorUuid}/subjects/bulk-delete`,
			{ ids }
		);
	};
}

export const majorSubjectService = new MajorSubjectService();
