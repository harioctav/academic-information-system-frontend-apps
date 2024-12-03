import { flexRender, Table, ColumnDef } from "@tanstack/react-table";
import {
	Table as UITable,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";

interface TableContentProps<TData> {
	table: Table<TData>;
	showSelection?: boolean;
	isSpecialRow?: (row: TData) => boolean;
	pagination: {
		pageIndex: number;
		pageSize: number;
	};
	columns: ColumnDef<TData>[];
}

export function TableContent<TData>({
	table,
	showSelection,
	isSpecialRow,
	pagination,
	columns,
}: TableContentProps<TData>) {
	const t = useTranslations();
	return (
		<div className="rounded-md border">
			<div className="overflow-x-auto">
				<div className="min-w-[800px]">
					<UITable>
						<TableHeader>
							<TableRow>
								{showSelection && (
									<TableHead className="sticky left-0 w-[50px] text-center">
										<div className="flex justify-center">
											<Checkbox
												checked={table.getIsAllPageRowsSelected()}
												onCheckedChange={(value) =>
													table.toggleAllPageRowsSelected(!!value)
												}
												aria-label="Select all"
												className="h-4 w-4"
											/>
										</div>
									</TableHead>
								)}
								<TableHead className="sticky left-0 w-16 text-center">
									No.
								</TableHead>
								{table.getHeaderGroups()[0].headers.map((header) => (
									<TableHead key={header.id} className="text-center">
										{header.isPlaceholder ? null : (
											<div className="flex justify-center items-center">
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
											</div>
										)}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={columns.length + (showSelection ? 2 : 1)}
										className="text-center"
									>
										{t("table.empty")}
									</TableCell>
								</TableRow>
							) : (
								table.getRowModel().rows.map((row, index) => (
									<TableRow key={row.id}>
										{showSelection && (
											<TableCell className="sticky left-0 text-center">
												<div className="flex justify-center">
													{!isSpecialRow?.(row.original) && (
														<Checkbox
															checked={row.getIsSelected()}
															onCheckedChange={(value) =>
																row.toggleSelected(!!value)
															}
															aria-label="Select row"
															className="h-4 w-4"
														/>
													)}
												</div>
											</TableCell>
										)}
										<TableCell className="sticky left-0 text-center">
											{pagination.pageIndex * pagination.pageSize + index + 1}
										</TableCell>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id} className="text-center">
												{flexRender(cell.column.columnDef.cell, {
													...cell.getContext(),
													isSpecialRow: isSpecialRow?.(row.original),
												})}
											</TableCell>
										))}
									</TableRow>
								))
							)}
						</TableBody>
					</UITable>
				</div>
			</div>
		</div>
	);
}
