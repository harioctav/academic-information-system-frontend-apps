"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { RecommendationForm } from "@/components/pages/evaluations/recommendation-form";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Permission } from "@/config/enums/permission.enum";
import { useRecommendationSubjectColumns } from "@/hooks/columns/evaluations/use.recommendation.subject.column";
import { useDataTable } from "@/hooks/use-datatable";
import { academicOptionService } from "@/lib/services/options/academic.option.service";
import { Student } from "@/types/academics/student";
import { Subject } from "@/types/academics/subject";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { use, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const RecommendationCreatePage = ({
	params,
}: {
	params: Promise<{ studentUuid: string }>;
}) => {
	const t = useTranslations();
	const resolvedParams = use(params);
	const [student, setStudent] = useState<Student | null>(null);

	/** Form Selected */
	const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("selectedSubjects");
			return saved ? JSON.parse(saved) : [];
		}
		return [];
	});

	useEffect(() => {
		const getStudentData = async () => {
			const response = await academicOptionService.showStudent(
				resolvedParams.studentUuid
			);
			setStudent(response.data);
		};

		getStudentData();
	}, [resolvedParams.studentUuid]);

	/** Setup DataTable */
	const {
		data,
		pageCount,
		pagination,
		sorting,
		searchQuery,
		setPagination,
		setSorting,
		setSearchQuery,
		isLoading,
	} = useDataTable<Subject>(
		(params) =>
			academicOptionService.getRecommendationSubjects(student?.uuid, {
				...params,
			}),
		{ studentUuid: student?.uuid }
	);

	const createColumns = useRecommendationSubjectColumns();
	const columns = createColumns() as ColumnDef<Subject>[];

	const handleSelectionChange = useCallback(
		(selectedIds: string[]) => {
			if (!Array.isArray(data)) return;

			const selected = data.filter((subject) =>
				selectedIds.includes(subject.uuid)
			);
			const totalSKS = selected.reduce(
				(sum, subject) => sum + Number(subject.course_credit),
				0
			);

			if (totalSKS > 24) {
				toast.error(t("validation.max_sks_exceeded"));
				return;
			}

			setSelectedSubjects(selected);
			localStorage.setItem("selectedSubjects", JSON.stringify(selected));
		},
		[data, t]
	);

	// Clear storage on unmount
	useEffect(() => {
		return () => {
			localStorage.removeItem("selectedSubjects");
		};
	}, []);

	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.evaluations.recommendations.create")}
						description={t("navigation.description.create", {
							page: t("navigation.menu.evaluations.recommendations.label"),
						})}
						action={{
							type: "back",
							url: `/evaluations/recommendations/${student?.uuid}/detail`,
							permission: Permission.RecommendationShow,
						}}
					/>
					<CardContent>
						<div className="relative p-1">
							{/* DataTables */}
							<DataTable<Subject>
								columns={columns}
								data={data}
								pageCount={pageCount}
								pagination={pagination}
								sorting={sorting}
								searchQuery={searchQuery}
								onPaginationChange={(pageIndex, pageSize) =>
									setPagination({ pageIndex, pageSize })
								}
								onSortingChange={(newSorting) => setSorting(newSorting)}
								onSearchChange={(query) => {
									setSearchQuery(query);
									setPagination({ ...pagination, pageIndex: 0 });
								}}
								isLoading={isLoading}
								customSelectionMode={true}
								onSelectionChange={handleSelectionChange}
								showSelection={true}
							/>

							<RecommendationForm selectedSubjects={selectedSubjects} />
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default RecommendationCreatePage;
