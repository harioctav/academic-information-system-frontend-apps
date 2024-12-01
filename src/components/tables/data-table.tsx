"use client";

import * as React from "react";
import {
	ColumnDef,
	SortingState,
	VisibilityState,
	getCoreRowModel,
	useReactTable,
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
	onSortingChange: (sorting: SortingState) => void;
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
		onSortingChange: (updater) => {
			const newSorting =
				typeof updater === "function" ? updater(sorting) : updater;
			onSortingChange(newSorting);
		},
		onPaginationChange: (updates) => {
			if (typeof updates === "function") {
				const { pageIndex, pageSize } = updates({
					pageIndex: pagination.pageIndex,
					pageSize: pagination.pageSize,
				});
				onPaginationChange(pageIndex, pageSize);
			}
		},
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		manualPagination: true,
		manualSorting: true,
		getCoreRowModel: getCoreRowModel(),
	});

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

	const selectedRows = table
		.getSelectedRowModel()
		.rows.map((row) => (row.original as { uuid: string }).uuid);

	const handleBulkDelete = () => {
		if (onBulkDelete && selectedRows.length > 0) {
			onBulkDelete(selectedRows);
			setRowSelection({});
			setIsDeleteDialogOpen(false);
		}
	};

	return (
		<div className="w-full overflow-hidden p-1">
			<TableToolbar
				table={table}
				pagination={pagination}
				showSelection={showSelection}
				selectedRows={selectedRows}
				inputValue={inputValue}
				onPaginationChange={onPaginationChange}
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
				onPaginationChange={onPaginationChange}
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
