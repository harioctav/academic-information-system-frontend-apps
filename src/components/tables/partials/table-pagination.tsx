import { Table } from "@tanstack/react-table";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface TablePaginationProps<TData> {
	table: Table<TData>;
	pagination: {
		pageIndex: number;
		pageSize: number;
	};
	onPaginationChange: (pageIndex: number, pageSize: number) => void;
	pageCount: number;
}

export function TablePagination<TData>({
	table,
	pagination,
	onPaginationChange,
	pageCount,
}: TablePaginationProps<TData>) {
	const renderPaginationItems = () => {
		const items = [];
		const currentPage = pagination.pageIndex + 1;

		for (let i = 1; i <= pageCount; i++) {
			if (
				i === 1 ||
				i === pageCount ||
				(i >= currentPage - 1 && i <= currentPage + 1)
			) {
				items.push(
					<PaginationItem key={i}>
						<PaginationLink
							onClick={() => onPaginationChange(i - 1, pagination.pageSize)}
							isActive={currentPage === i}
						>
							{i}
						</PaginationLink>
					</PaginationItem>
				);
			} else if (i === currentPage - 2 || i === currentPage + 2) {
				items.push(
					<PaginationItem key={i}>
						<PaginationLink>...</PaginationLink>
					</PaginationItem>
				);
			}
		}
		return items;
	};

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
			<div className="text-sm text-muted-foreground order-2 sm:order-1">
				Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
				{Math.min(
					(pagination.pageIndex + 1) * pagination.pageSize,
					table.getFilteredRowModel().rows.length
				)}{" "}
				of {table.getFilteredRowModel().rows.length} entries
			</div>
			<div className="flex items-center space-x-6 order-1 sm:order-2">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={(e) => {
									e.preventDefault();
									onPaginationChange(
										pagination.pageIndex - 1,
										pagination.pageSize
									);
								}}
								className={
									!table.getCanPreviousPage()
										? "pointer-events-none opacity-50"
										: ""
								}
							/>
						</PaginationItem>

						{renderPaginationItems()}

						<PaginationItem>
							<PaginationNext
								href="#"
								onClick={(e) => {
									e.preventDefault();
									onPaginationChange(
										pagination.pageIndex + 1,
										pagination.pageSize
									);
								}}
								className={
									!table.getCanNextPage()
										? "pointer-events-none opacity-50"
										: ""
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}
