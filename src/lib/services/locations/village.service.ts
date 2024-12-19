import { BaseService } from "@/lib/base.service";
import { Params } from "@/types/api";
import { Village, VillageRequest } from "@/types/locations/village";

class VillageService extends BaseService {
	constructor() {
		super("/locations/villages");
	}

	getVillages = (params: Params) => {
		return this.get<Village[]>("", params);
	};

	storeVillage = (request: VillageRequest) => {
		return this.post<VillageRequest, Village>("", request);
	};

	showVillage = (uuid: string) => {
		return this.get<Village>(`/${uuid}`);
	};

	updateVillage = (uuid: string, request: VillageRequest) => {
		return this.put<VillageRequest, Village>(`/${uuid}`, request);
	};

	deleteVillage = (uuid: string) => {
		return this.delete<void, Village>(`/${uuid}`);
	};

	bulkDeleteVillages = (ids: string[]) => {
		return this.delete<{ ids: string[] }, Village>("/bulk-delete", { ids });
	};
}

export const villageService = new VillageService();
