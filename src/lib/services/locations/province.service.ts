import { BaseService } from "@/lib/base.service";
import { Params } from "@/types/api";
import { Province, ProvinceRequest } from "@/types/locations/province";

class ProvinceService extends BaseService {
	constructor() {
		super("/locations/provinces");
	}

	getProvinces = (params: Params) => {
		return this.get<Province[]>("", params);
	};

	storeProvince = (request: ProvinceRequest) => {
		return this.post<ProvinceRequest, Province>("", request);
	};

	showProvince = (uuid: string) => {
		return this.get<Province>(`/${uuid}`);
	};

	updateProvince = (uuid: string, request: ProvinceRequest) => {
		return this.put<ProvinceRequest, Province>(`/${uuid}`, request);
	};

	deleteProvince = (uuid: string) => {
		return this.delete<void, Province>(`/${uuid}`);
	};

	bulkDeleteProvinces = (ids: string[]) => {
		return this.delete<{ ids: string[] }, Province>("/bulk-delete", { ids });
	};
}

export const provinceService = new ProvinceService();
