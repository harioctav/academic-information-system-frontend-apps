import { BaseService } from "@/lib/base.service";
import { Params } from "@/types/api";
import { PermissionCategory } from "@/types/settings/permission-category";

class PermissionCategoryService extends BaseService {
	constructor() {
		super("/settings/permission-categories");
	}

	getPermissionCategories = (params: Params) => {
		return this.get<PermissionCategory[]>("", params);
	};
}

export const permissionCategoryService = new PermissionCategoryService();
