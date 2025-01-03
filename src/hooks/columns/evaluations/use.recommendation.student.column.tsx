"use client";

import { ActionColumn } from "@/components/tables/partials/action-column";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Permission } from "@/config/enums/permission.enum";
import { getStatusRegistrationLabel } from "@/config/enums/status.registration.enum";
import { Student } from "@/types/academics/student";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";

export const useRecommendationStudentColumns = () => {
	/** Translate */
	const t = useTranslations();

	const createColumns = () => {
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
				accessorKey: "major.name",
				header: t("module.academic.majors"),
				cell: ({ row }) => row.original.major.name,
			},
			{
				accessorKey: "status_registration",
				header: t("input.common.status_registration.label"),
				cell: ({ row }) =>
					getStatusRegistrationLabel(row.original.status_registration),
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
								showUrl={`/evaluations/recommendations/${row.original.uuid}/detail`}
								showPermission={Permission.RecommendationShow}
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
