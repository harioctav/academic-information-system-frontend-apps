import { useState, useEffect, useCallback } from "react";
import { SortingState } from "@tanstack/react-table";
import { Params } from "@/types/api";

interface FetchResponse<TData> {
	data: TData[];
	meta?: {
		last_page: number;
	};
}

export function useDataTable<TData>(
	fetchFunction: (params: Params) => Promise<FetchResponse<TData>>,
	extraParams?: Record<string, unknown>
) {
	const [data, setData] = useState<TData[]>([]);
	const [pageCount, setPageCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 5,
	});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [searchQuery, setSearchQuery] = useState("");

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			const sortBy = sorting.length > 0 ? sorting[0].id : "created_at";
			const sortDirection = (
				sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc"
			) as "asc" | "desc";

			const params: Params = {
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
		} catch (error) {
			console.error("Failed to fetch data:", error);
		} finally {
			setLoading(false);
		}
	}, [
		pagination.pageIndex,
		pagination.pageSize,
		sorting,
		searchQuery,
		extraParams,
		fetchFunction,
	]);

	useEffect(() => {
		const timer = setTimeout(() => {
			fetchData();
		}, 300);
		return () => clearTimeout(timer);
	}, [fetchData]);

	return {
		data,
		pageCount,
		pagination,
		sorting,
		searchQuery,
		loading,
		setPagination,
		setSorting,
		setSearchQuery,
		fetchData,
	};
}
