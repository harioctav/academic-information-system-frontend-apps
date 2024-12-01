import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { ColumnVisibilityDropdown } from "@/components/tables/partials/column-visibility-dropdown";
import { useTranslations } from "next-intl";

interface TableToolbarProps<TData> {
	table: Table<TData>;
	pagination: {
		pageSize: number;
	};
	showSelection?: boolean;
	selectedRows: string[];
	inputValue: string;
	onPaginationChange: (pageIndex: number, pageSize: number) => void;
	setIsDeleteDialogOpen: (value: boolean) => void;
	handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onSearchChange: (query: string) => void;
	setInputValue: (value: string) => void;
}

export function TableToolbar<TData>({
	table,
	pagination,
	showSelection,
	selectedRows,
	inputValue,
	onPaginationChange,
	setIsDeleteDialogOpen,
	handleSearch,
	onSearchChange,
	setInputValue,
}: TableToolbarProps<TData>) {
	const t = useTranslations();

	const handlePageSizeChange = (size: number) => {
		onPaginationChange(0, size);
	};

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-1 sm:px-0">
			<div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
				<Select
					value={`${pagination.pageSize}`}
					onValueChange={(value) => handlePageSizeChange(Number(value))}
				>
					<SelectTrigger className="w-[60px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{[5, 10, 30, 50].map((size) => (
							<SelectItem key={size} value={`${size}`}>
								{size}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{showSelection && (
					<Button
						variant="destructive"
						size="sm"
						onClick={() => setIsDeleteDialogOpen(true)}
						disabled={selectedRows.length === 0}
						className="w-full sm:w-auto"
					>
						<Trash2 className="h-4 w-4 mr-2" />
						{t("button.delete-selected")} ({selectedRows.length})
					</Button>
				)}
			</div>

			<div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
				<SearchInput
					value={inputValue}
					onChange={handleSearch}
					onClear={() => {
						setInputValue("");
						onSearchChange("");
					}}
				/>
				<ColumnVisibilityDropdown table={table} />
			</div>
		</div>
	);
}
