import { BaseService } from "@/lib/base.service";
import { Major } from "@/types/academics/major";
import { Params } from "@/types/api";

class MajorOptionService extends BaseService {
	constructor() {
		super("/options/academics/majors");
	}

	getMajors = (params: Params) => {
		return this.get<Major[]>("", params);
	};

	showMajor = (uuid: string) => {
		return this.get<Major>(`/${uuid}`);
	};
}

export const majorOptionService = new MajorOptionService();
