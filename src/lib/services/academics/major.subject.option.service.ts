import { BaseService } from "@/lib/base.service";
import { MajorSubject } from "@/types/academics/major.subject";

class MajorSubjectOptionService extends BaseService {
	constructor() {
		super("/options/majors");
	}

	showMajorSubject = (majorUuid: string, majorSubjectUuid: string) => {
		return this.get<MajorSubject>(`/${majorUuid}/subjects/${majorSubjectUuid}`);
	};
}

export const majorSubjectOptionService = new MajorSubjectOptionService();
