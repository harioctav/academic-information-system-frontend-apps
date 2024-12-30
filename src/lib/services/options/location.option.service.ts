import { BaseService } from "@/lib/base.service";
import { Params } from "@/types/api";
import { District } from "@/types/locations/district";
import { Province } from "@/types/locations/province";
import { Regency } from "@/types/locations/regency";
import { Village } from "@/types/locations/village";

class LocationOptionService extends BaseService {
	constructor() {
		super("/options/locations");
	}

	/** Provinces */
	getProvinces = (params: Params) => {
		return this.get<Province[]>("/provinces", params);
	};

	showProvince = (uuid: string) => {
		return this.get<Province>(`/provinces/${uuid}`);
	};
	/** Provinces */

	/** Regencies */
	getRegencies = (params: Params) => {
		return this.get<Regency[]>("/regencies", params);
	};

	showRegency = (uuid: string) => {
		return this.get<Regency>(`/regencies/${uuid}`);
	};
	/** Regencies */

	/** Districts */
	getDistricts = (params: Params) => {
		return this.get<District[]>("/districts", params);
	};

	showDistrict = (uuid: string) => {
		return this.get<District>(`/districts/${uuid}`);
	};
	/** Districts */

	/** Villages */
	getVillages = (params: Params) => {
		return this.get<Village[]>("/villages", params);
	};

	showVillage = (uuid: string) => {
		return this.get<Village>(`/villages/${uuid}`);
	};
	/** Villages */
}

export const locationOptionService = new LocationOptionService();
