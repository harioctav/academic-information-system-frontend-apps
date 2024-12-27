import { ApiResponse } from "@/types/api";

export interface Dashboard {
	users: number;
	subjects: number;
  majors: number;
  students: number
}

export type DashboardResponse = ApiResponse<Dashboard>;
