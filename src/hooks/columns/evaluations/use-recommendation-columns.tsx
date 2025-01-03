"use client";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { ActionColumn } from "@/components/tables/partials/action-column";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Permission } from "@/config/enums/permission.enum";
import {
	getRecommendationNoteBadgeVariant,
	getRecommendationNoteLabel,
} from "@/config/enums/recommendation.note.enum";
import { getSemesterLabel } from "@/config/enums/semester.enum";
import { recommendationService } from "@/lib/services/evaluations/recommendation.service";
import { Recommendation } from "@/types/evaluations/recommendation";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export const useRecommendationColumns = () => {
	const t = useTranslations();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedRecommendationUuid, setSelectedRecommendationUuid] = useState<
		string | null
	>(null);

	// Handle Delete Data
	const handleDelete = async (uuid: string, onSuccess: () => void) => {
		try {
			const response = await recommendationService.deleteRecommendation(uuid);
			toast.success(response.message);
			onSuccess();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "An error occurred");
		} finally {
			setIsDeleteDialogOpen(false);
			setSelectedRecommendationUuid(null);
		}
	};

	const createColumns = (
		refreshData: () => void,
		onEdit?: (uuid: string) => void
	) => {
		const columns: ColumnDef<Recommendation>[] = [
			{
				accessorKey: "subject.code",
				header: t("input.common.code.label"),
				cell: ({ row }) => row.original.subject.code,
			},
			{
				accessorKey: "subject.name",
				header: "Subject",
				cell: ({ row }) => row.original.subject.name,
			},
			{
				accessorKey: "semester",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="w-full"
						>
							{t("input.common.semester.label")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => getSemesterLabel(row.original.semester),
			},
			{
				accessorKey: "exam_period",
				header: t("input.common.exam_period.label"),
			},
			{
				accessorKey: "recommendation_note",
				header: t("input.common.recommendation_note.label"),
				cell: ({ row }) => (
					<Badge
						variant={getRecommendationNoteBadgeVariant(
							row.original.recommendation_note
						)}
					>
						{getRecommendationNoteLabel(row.original.recommendation_note)}
					</Badge>
				),
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
								editPermission={Permission.RecommendationEdit}
								deletePermission={Permission.RecommendationDelete}
								onDelete={() => {
									setSelectedRecommendationUuid(row.original.uuid);
									setIsDeleteDialogOpen(true);
								}}
							/>

							<ConfirmationDialog
								isOpen={
									isDeleteDialogOpen &&
									selectedRecommendationUuid === row.original.uuid
								}
								onClose={() => {
									setIsDeleteDialogOpen(false);
									setSelectedRecommendationUuid(null);
								}}
								onConfirm={() => handleDelete(row.original.uuid, refreshData)}
								title={t("navigation.menu.evaluations.recommendations.delete")}
								description={t("dialog.delete.description", {
									page: t("navigation.menu.evaluations.recommendations.label"),
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
