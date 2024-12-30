import { BaseService } from "@/lib/base.service";
import { Village } from "@/types/locations/village";

class LocationSelectService extends BaseService {
	constructor() {
		super("/options/selects");
	}

	showVillage = (id: number) => {
		return this.get<Village>(`/village/${id}`);
	};
	/** Villages */
}

export const locationSelectService = new LocationSelectService();
