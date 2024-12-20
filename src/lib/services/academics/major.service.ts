import { BaseService } from "@/lib/base.service";
import { Major, MajorRequest } from "@/types/academics/major";
import { Params } from "@/types/api";

class MajorService extends BaseService {
	constructor() {
		super("/academics/majors");
	}

	getMajors = (params: Params) => {
		return this.get<Major[]>("", params);
	};

	storeMajor = (request: MajorRequest) => {
		return this.post<MajorRequest, Major>("", request);
	};

	showMajor = (uuid: string) => {
		return this.get<Major>(`/${uuid}`);
	};

	updateMajor = (uuid: string, request: MajorRequest) => {
		return this.put<MajorRequest, Major>(`/${uuid}`, request);
	};

	deleteMajor = (uuid: string) => {
		return this.delete<void, Major>(`/${uuid}`);
	};

	bulkDeleteMajors = (ids: string[]) => {
		return this.delete<{ ids: string[] }, Major>("/bulk-delete", { ids });
	};
}

export const majorService = new MajorService();
