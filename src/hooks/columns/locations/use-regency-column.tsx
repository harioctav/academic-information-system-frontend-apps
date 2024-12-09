"use client";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { ActionColumn } from "@/components/tables/partials/action-column";
import { Button } from "@/components/ui/button";
import { Permission } from "@/config/enums/permission.enum";
import { regencyService } from "@/lib/services/locations/regency.service";
import { Regency } from "@/types/locations/regency";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export const useRegencyColumns = () => {
	const t = useTranslations();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

	const handleDelete = async (uuid: string, onSuccess: () => void) => {
		try {
			const response = await regencyService.deleteRegency(uuid);
			toast.success(response.message);
			onSuccess();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "An error occurred");
		} finally {
			setIsDeleteDialogOpen(false);
			setSelectedUuid(null);
		}
	};

	const createColumns = (
		refreshData: () => void,
		onEdit?: (uuid: string) => void
	) => {
		const columns: ColumnDef<Regency>[] = [
			{
				accessorKey: "province.name",
				header: t("input.location.province.label"),
			},
			{
				accessorKey: "name",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="w-full"
						>
							{t("input.common.name.label")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => {
					return `${row.original.type} ${row.original.name}`;
				},
			},
			{
				accessorKey: "code",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="w-full"
						>
							{t("input.common.code.label")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
			},
			{
				accessorKey: "full_code",
				header: t("input.meta.full_code.label"),
			},
			{
				accessorKey: "created_at",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="w-full"
						>
							{t("input.meta.created_at.label")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => row.original.created_at.formatted,
				enableHiding: true,
			},
			{
				accessorKey: "updated_at",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="w-full"
						>
							{t("input.meta.updated_at.label")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => row.original.updated_at.formatted,
				enableHiding: true,
			},
			{
				id: "actions",
				header: () => (
					<div className="flex justify-center">
						<Settings2 className="h-4 w-4" />
					</div>
				),
				cell: ({ row }) => {
					return (
						<>
							<ActionColumn
								onEdit={() => onEdit?.(row.original.uuid)}
								editPermission={Permission.RegencyEdit}
								deletePermission={Permission.RegencyDelete}
								onDelete={() => {
									setSelectedUuid(row.original.uuid);
									setIsDeleteDialogOpen(true);
								}}
							/>

							<ConfirmationDialog
								isOpen={
									isDeleteDialogOpen && selectedUuid === row.original.uuid
								}
								onClose={() => {
									setIsDeleteDialogOpen(false);
									setSelectedUuid(null);
								}}
								onConfirm={() => handleDelete(row.original.uuid, refreshData)}
								title={t("navigation.menu.locations.regencies.delete")}
								description={t("dialog.delete.description", {
									page: t("navigation.menu.locations.regencies.label"),
								})}
								confirmText={t("button.common.delete")}
								cancelText={t("button.common.cancel")}
							/>
						</>
					);
				},
			},
		];

		return columns;
	};

	return createColumns;
};
