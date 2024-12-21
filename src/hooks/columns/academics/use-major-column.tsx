"use client";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { ActionColumn } from "@/components/tables/partials/action-column";
import { Button } from "@/components/ui/button";
import { getDegreeLabel } from "@/config/enums/degree.type.enum";
import { Permission } from "@/config/enums/permission.enum";
import { majorService } from "@/lib/services/academics/major.service";
import { Major } from "@/types/academics/major";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export const useMajorColumns = () => {
	const t = useTranslations();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

	// Handle Delete Data
	const handleDelete = async (uuid: string, onSuccess: () => void) => {
		try {
			const response = await majorService.deleteMajor(uuid);
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
		const columns: ColumnDef<Major>[] = [
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
			},
			{
				accessorKey: "degree",
				header: t("input.common.degree.label"),
				cell: ({ row }) => getDegreeLabel(row.original.degree),
			},
			{
				accessorKey: "total_course_credit",
				header: t("input.common.total_course_credit.label"),
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
								showUrl={`/academics/majors/show/${row.original.uuid}`}
								onEdit={() => onEdit?.(row.original.uuid)}
								editPermission={Permission.MajorEdit}
								showPermission={Permission.MajorShow}
								deletePermission={Permission.MajorDelete}
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
								title={t("navigation.menu.academics.majors.delete")}
								description={t("dialog.delete.description", {
									page: t("navigation.menu.academics.majors.label"),
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
