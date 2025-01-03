import { BaseService } from "@/lib/base.service";
import { Student } from "@/types/academics/student";
import { Params } from "@/types/api";
import {
	Recommendation,
	RecommendationRequest,
} from "@/types/evaluations/recommendation";

class RecommendationService extends BaseService {
	constructor() {
		super("/evaluations/recommendations");
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param params
	 * @returns
	 */
	getRecommendations = (params: Params) => {
		return this.get<Student[]>("", params);
	};

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param request
	 * @param studentUuid
	 * @returns
	 */
	storeRecommendation = (
		request: RecommendationRequest,
		studentUuid: string
	) => {
		return this.post<RecommendationRequest>(`/${studentUuid}`, request);
	};

	/**
	 * Display a listing of the resource.
	 *
	 * @param studentUuid
	 * @param params
	 * @returns
	 */
	showRecommendation = (studentUuid?: string, params?: Params) => {
		if (!studentUuid) return Promise.resolve({ data: [] });
		return this.get<Recommendation[]>(`/${studentUuid}`, params);
	};

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param recommendationUuid
	 * @returns
	 */
	deleteRecommendation = (recommendationUuid: string) => {
		return this.delete<void, Recommendation>(`/${recommendationUuid}`);
	};

	/**
	 * Remove multiple resources from storage.
	 *
	 * @param ids
	 * @returns
	 */
	bulkDeleteRecommendations = (ids: string[]) => {
		return this.delete<{ ids: string[] }, Recommendation>("/bulk-delete", {
			ids,
		});
	};
}

export const recommendationService = new RecommendationService();
