import { BaseService } from "@/lib/base.service";
import { Params } from "@/types/api";
import { District, DistrictRequest } from "@/types/locations/district";

class DistrictService extends BaseService {
	constructor() {
		super("/locations/districts");
	}

	getDistricts = (params: Params) => {
		return this.get<District[]>("", params);
	};

	storeDistrict = (request: DistrictRequest) => {
		return this.post<DistrictRequest, District>("", request);
	};

	showDistrict = (uuid: string) => {
		return this.get<District>(`/${uuid}`);
	};

	updateDistrict = (uuid: string, request: DistrictRequest) => {
		return this.put<DistrictRequest, District>(`/${uuid}`, request);
	};

	deleteDistrict = (uuid: string) => {
		return this.delete<void, District>(`/${uuid}`);
	};

	bulkDeleteDistricts = (ids: string[]) => {
		return this.delete<{ ids: string[] }, District>("/bulk-delete", { ids });
	};
}

export const districtService = new DistrictService();
