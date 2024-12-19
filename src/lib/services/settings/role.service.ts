import { BaseService } from "@/lib/base.service";
import { Params } from "@/types/api";
import { Role, RoleRequest } from "@/types/settings/role";

class RoleService extends BaseService {
	constructor() {
		super("/settings/roles");
	}

	getRoles = (params: Params) => {
		return this.get<Role[]>("", params);
	};

	showRole = (uuid: string) => {
		return this.get<Role>(`/${uuid}`);
	};

	updateRole = (uuid: string, request: RoleRequest) => {
		return this.put<RoleRequest, Role>(`/${uuid}`, request);
	};

	deleteRole = (uuid: string) => {
		return this.delete<void, Role>(`/${uuid}`);
	};

	bulkDeleteRoles = (ids: string[]) => {
		return this.delete<{ ids: string[] }, Role>("/bulk-delete", { ids });
	};
}

export const roleService = new RoleService();
