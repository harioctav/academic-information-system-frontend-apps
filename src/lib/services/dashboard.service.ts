import { BaseService } from "@/lib/base.service";
import { Dashboard } from "@/types/dashboard";

class DashboardService extends BaseService {
	constructor() {
		super("/");
	}

	dashboardData = () => {
		return this.get<Dashboard>("home");
	};
}

export const dashboardService = new DashboardService();
