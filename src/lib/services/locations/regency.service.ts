import { BaseService } from "@/lib/base.service";
import { Params } from "@/types/api";
import { Regency, RegencyRequest } from "@/types/locations/regency";

class RegencyService extends BaseService {
	constructor() {
		super("/locations/regencies");
	}

	getRegencies = (params: Params) => {
		return this.get<Regency[]>("", params);
	};

	storeRegency = (request: RegencyRequest) => {
		return this.post<RegencyRequest, Regency>("", request);
	};

	showRegency = (uuid: string) => {
		return this.get<Regency>(`/${uuid}`);
	};

	updateRegency = (uuid: string, request: RegencyRequest) => {
		return this.put<RegencyRequest, Regency>(`/${uuid}`, request);
	};

	deleteRegency = (uuid: string) => {
		return this.delete<void, Regency>(`/${uuid}`);
	};

	bulkDeleteRegencies = (ids: string[]) => {
		return this.delete<{ ids: string[] }, Regency>("/bulk-delete", { ids });
	};
}

export const regencyService = new RegencyService();
