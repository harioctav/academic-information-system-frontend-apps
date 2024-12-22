import { BaseService } from "@/lib/base.service";
import {
	MajorSubject,
	MajorSubjectRequest,
} from "@/types/academics/major.subject";
import { Params } from "@/types/api";

class MajorSubjectService extends BaseService {
	constructor() {
		super("/academics/majors");
	}

	getMajorSubjects = (majorUuid: string, params: Params) => {
		return this.get<MajorSubject[]>(`/${majorUuid}/subjects`, params);
	};

	storeMajorSubject = (majorUuid: string, request: MajorSubjectRequest) => {
		// Since we expect only a message response, we don't need to specify a response type
		return this.post<MajorSubjectRequest>(`/${majorUuid}/subjects`, request);
	};

	showMajorSubject = (majorUuid: string, majorSubjectUuid: string) => {
		return this.get<MajorSubject>(`/${majorUuid}/subjects/${majorSubjectUuid}`);
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
