import { useState, useEffect, useCallback } from "react";
import { SortingState } from "@tanstack/react-table";

interface FetchParams {
	page: number;
	perPage: number;
	sortBy: string;
	sortDirection: "asc" | "desc";
	search: string;
	[key: string]: unknown;
}

interface FetchResponse<TData> {
	data: TData[];
	meta?: {
		last_page: number;
	};
}

export function useDataTable<TData>(
	fetchFunction: (params: FetchParams) => Promise<FetchResponse<TData>>,
	extraParams?: Record<string, unknown>
) {
	const [data, setData] = useState<TData[]>([]);
	const [pageCount, setPageCount] = useState(0);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 5,
	});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [searchQuery, setSearchQuery] = useState("");

	const fetchData = useCallback(async () => {
		const sortBy = sorting.length > 0 ? sorting[0].id : "created_at";
		const sortDirection = (
			sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc"
		) as "asc" | "desc";

		const params: FetchParams = {
			page: pagination.pageIndex + 1,
			perPage: pagination.pageSize,
			sortBy,
			sortDirection,
			search: searchQuery,
			...extraParams,
		};

		const response = await fetchFunction(params);
		setData(response.data);
		setPageCount(response.meta?.last_page || 0);
	}, [fetchFunction, pagination, sorting, searchQuery, extraParams]);

	const serializedExtraParams = JSON.stringify(extraParams);

	useEffect(() => {
		fetchData();
	}, [fetchData, serializedExtraParams]);

	return {
		data,
		pageCount,
		pagination,
		sorting,
		searchQuery,
		setPagination,
		setSorting,
		setSearchQuery,
		fetchData,
	};
}
