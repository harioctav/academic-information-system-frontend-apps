"use client";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { ActionColumn } from "@/components/tables/partials/action-column";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getGenderTypeLabel } from "@/config/enums/gender.type.enum";
import { Permission } from "@/config/enums/permission.enum";
import { studentService } from "@/lib/services/academics/student.service";
import { Student } from "@/types/academics/student";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export const useStudentColumns = () => {
	/** Translate */
	const t = useTranslations();

	/** Dialog setup */
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

	/**
	 * Handles the deletion of a student by making a request to the student service and updating the UI accordingly.
	 *
	 * @param uuid - The unique identifier of the student to be deleted.
	 * @param onSuccess - A callback function to be executed upon successful deletion.
	 */
	const handleDelete = async (uuid: string, onSuccess: () => void) => {
		try {
			const response = await studentService.deleteStudent(uuid);
			toast.success(response.message);
			onSuccess();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "An error occurred");
		} finally {
			setIsDeleteDialogOpen(false);
			setSelectedUuid(null);
		}
	};

	const createColumns = (refreshData: () => void) => {
		/** Setup Student Columns */
		const columns: ColumnDef<Student>[] = [
			{
				accessorKey: "student_photo_url",
				header: t("input.user.photo.label"),
				cell: ({ row }) => {
					const student = row.original;
					return (
						<Avatar className="h-8 w-8 circle">
							<AvatarImage
								src={student.student_photo_url || undefined}
								alt={student.name}
							/>
							<AvatarFallback className="circle">
								{student.name.substring(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
					);
				},
			},
			{
				accessorKey: "nim",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="w-full"
						>
							{t("input.common.nim.label")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
			},
			{
				accessorKey: "nik",
				header: t("input.common.nik.label"),
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
				accessorKey: "email",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="w-full"
						>
							{t("input.user.email.label")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
			},
			{
				accessorKey: "gender",
				header: t("input.common.gender.label"),
				cell: ({ row }) => getGenderTypeLabel(row.original.gender, t),
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
								editUrl={`/academics/students/${row.original.uuid}/edit`}
								showUrl={`/academics/students/${row.original.uuid}/show`}
								showPermission={Permission.StudentShow}
								editPermission={Permission.StudentEdit}
								deletePermission={Permission.StudentDelete}
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
								title={t("navigation.menu.academics.students.delete")}
								description={t("dialog.delete.description", {
									page: t("navigation.menu.academics.students.label"),
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
