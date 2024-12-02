"use client";

import * as React from "react";
import {
	ColumnDef,
	SortingState,
	VisibilityState,
	getCoreRowModel,
	useReactTable,
	OnChangeFn,
} from "@tanstack/react-table";
import { TableToolbar } from "@/components/tables/partials/table-toolbar";
import { TablePagination } from "@/components/tables/partials/table-pagination";
import { TableContent } from "@/components/tables/partials/table-content";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { useTranslations } from "next-intl";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, unknown>[];
	data: TData[];
	pageCount: number;
	pagination: {
		pageIndex: number;
		pageSize: number;
	};
	sorting: SortingState;
	searchQuery: string;
	onPaginationChange: (pageIndex: number, pageSize: number) => void;
	onSortingChange: OnChangeFn<SortingState>;
	onSearchChange: (query: string) => void;
	onBulkDelete?: (selectedRows: string[]) => void;
	showSelection?: boolean;
	isSpecialRow?: (row: TData) => boolean;
}

export function DataTable<TData>({
	columns,
	data,
	pageCount,
	pagination,
	sorting,
	searchQuery,
	onPaginationChange,
	onSortingChange,
	onSearchChange,
	onBulkDelete,
	showSelection,
	isSpecialRow,
}: DataTableProps<TData>) {
	const t = useTranslations();
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({
			created_at: false,
			updated_at: false,
			full_code: false,
			code: false,
		});
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState(searchQuery);

	React.useEffect(() => {
		setRowSelection({});
	}, [data]);

	const handleSearch = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value;
			setInputValue(value);
			const timeoutId = setTimeout(() => {
				onSearchChange(value);
			}, 500);
			return () => clearTimeout(timeoutId);
		},
		[onSearchChange]
	);

	const handlePaginationChange = React.useCallback(
		(pageIndex: number, pageSize: number) => {
			onPaginationChange(pageIndex, pageSize);
		},
		[onPaginationChange]
	);

	const table = useReactTable({
		data,
		columns,
		pageCount,
		state: {
			sorting,
			pagination: {
				pageIndex: pagination.pageIndex,
				pageSize: pagination.pageSize,
			},
			rowSelection,
			columnVisibility,
		},
		enableRowSelection: showSelection
			? (row) => !isSpecialRow?.(row.original)
			: false,
		onSortingChange,
		onPaginationChange: (updates) => {
			if (typeof updates === "function") {
				const { pageIndex, pageSize } = updates({
					pageIndex: pagination.pageIndex,
					pageSize: pagination.pageSize,
				});
				handlePaginationChange(pageIndex, pageSize);
			}
		},
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		manualPagination: true,
		manualSorting: true,
		getCoreRowModel: getCoreRowModel(),
	});

	const selectedRows = React.useMemo(
		() =>
			Object.keys(rowSelection).length > 0
				? table
						.getSelectedRowModel()
						.rows.map((row) => (row.original as { uuid: string }).uuid)
				: [],
		[table, rowSelection]
	);

	const handleBulkDelete = React.useCallback(() => {
		if (onBulkDelete && selectedRows.length > 0) {
			onBulkDelete(selectedRows);
			setRowSelection({});
			setIsDeleteDialogOpen(false);
		}
	}, [onBulkDelete, selectedRows]);

	return (
		<div className="w-full overflow-hidden p-1">
			<TableToolbar
				table={table}
				pagination={pagination}
				showSelection={showSelection}
				selectedRows={selectedRows}
				inputValue={inputValue}
				onPaginationChange={handlePaginationChange}
				setIsDeleteDialogOpen={setIsDeleteDialogOpen}
				handleSearch={handleSearch}
				onSearchChange={onSearchChange}
				setInputValue={setInputValue}
			/>

			<TableContent
				table={table}
				showSelection={showSelection}
				isSpecialRow={isSpecialRow}
				pagination={pagination}
				columns={columns}
			/>

			<TablePagination
				table={table}
				pagination={pagination}
				onPaginationChange={handlePaginationChange}
				pageCount={pageCount}
			/>

			{showSelection && (
				<ConfirmationDialog
					isOpen={isDeleteDialogOpen}
					onClose={() => setIsDeleteDialogOpen(false)}
					onConfirm={handleBulkDelete}
					title={t("dialog.delete-selected.title")}
					description={t("dialog.delete-selected.description", {
						selected: selectedRows.length,
					})}
					confirmText={t("button.delete")}
					cancelText={t("button.cancel")}
				/>
			)}
		</div>
	);
}
