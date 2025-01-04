"use client";

import { Button } from "@/components/ui/button";
import { getSubjectStatusLabel } from "@/config/enums/subject.status.enum";
import { Subject } from "@/types/academics/subject";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

export const useRecommendationSubjectColumns = () => {
	/** Translate */
	const t = useTranslations();

	/** Setup Columns */
	const createColumns = () => {
		const columns: ColumnDef<Subject>[] = [
			{
				accessorKey: "semester",
				header: t("input.common.semester.label"),
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
				accessorKey: "grades",
				header: t("input.common.grade.label"),
				cell: ({ row }) => {
					const grades = row.original.grades;
					if (!grades || grades.length === 0) return "-";
					// Return the latest grade if exists
					return grades[grades.length - 1].grade || "-";
				},
			},
			{
				accessorKey: "course_credit",
				header: t("input.common.course_credit.label"),
			},
			{
				accessorKey: "subject_note",
				header: t("input.common.subject_note.label"),
				cell: ({ row }) => {
					return row.original.subject_note || "-";
				},
			},
			{
				accessorKey: "recommendations",
				header: t("input.common.recommendation_note.label"),
				cell: ({ row }) => {
					const recommendations = row.original.recommendations;
					if (!recommendations || recommendations.length === 0) return "-";
					// Return the latest recommendation note if exists
					return (
						recommendations[recommendations.length - 1].recommendation_note ||
						"-"
					);
				},
			},
			{
				accessorKey: "subject_status",
				header: t("input.common.subject_status.label"),
				cell: ({ row }) => getSubjectStatusLabel(row.original.subject_status),
			},
		];

		return columns;
	};

	return createColumns;
};
