"use client";

import { DynamicSelectRS } from "@/components/forms/dynamic-select-react";
import { MainLayout } from "@/components/layouts/main-layout";
import { StudentProfileCard } from "@/components/pages/academics/students/student-profile-card";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Permission } from "@/config/enums/permission.enum";
import { getRecommendationNoteOptions } from "@/config/enums/recommendation.note.enum";
import { getSemesterOptions } from "@/config/enums/semester.enum";
import { useRecommendationColumns } from "@/hooks/columns/evaluations/use-recommendation-columns";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useDataTable } from "@/hooks/use-datatable";
import { recommendationService } from "@/lib/services/evaluations/recommendation.service";
import { academicOptionService } from "@/lib/services/options/academic.option.service";
import { Student } from "@/types/academics/student";
import { Recommendation } from "@/types/evaluations/recommendation";
import { ColumnDef } from "@tanstack/react-table";
import { GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

const RecommendationShowPage = ({
	params,
}: {
	params: Promise<{ studentUuid: string }>;
}) => {
	const t = useTranslations();
	const { hasPermission } = usePermissions();
	const resolvedParams = use(params);
	const [student, setStudent] = useState<Student | null>(null);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedUuid, setSelectedUuid] = useState<string | undefined>();

	/** Filter */
	const [recommendationNoteFilter, setRecommendationNoteFilter] = useState<
		string | undefined
	>(undefined);
	const [semesterFilter, setSemesterFilter] = useState<string | undefined>(
		undefined
	);

	useEffect(() => {
		const getStudentData = async () => {
			const response = await academicOptionService.showStudent(
				resolvedParams.studentUuid
			);
			setStudent(response.data);
		};

		getStudentData();
	}, [resolvedParams.studentUuid]);

	// DataTable setup
	const {
		data,
		pageCount,
		pagination,
		sorting,
		searchQuery,
		setPagination,
		setSorting,
		setSearchQuery,
		fetchData,
		isLoading,
	} = useDataTable<Recommendation>(
		(params) =>
			recommendationService.showRecommendation(student?.uuid, {
				...params,
				filters: {
					...params.filters,
					...(recommendationNoteFilter && {
						recommendation_note: recommendationNoteFilter,
					}),
					...(semesterFilter && {
						semester: semesterFilter,
					}),
				},
			}),
		{ studentUuid: student?.uuid }
	);

	const handleEdit = (uuid: string) => {
		setSelectedUuid(uuid);
		setIsDialogOpen(true);
	};

	const handleBulkDelete = async (selectedIds: string[]) => {
		try {
			const response = await recommendationService.bulkDeleteRecommendations(
				selectedIds
			);
			toast.success(response.message);
			await fetchData();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "An error occurred");
		}
	};

	const createColumns = useRecommendationColumns();

	const columns = createColumns(
		fetchData,
		handleEdit
	) as ColumnDef<Recommendation>[];

	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card className="mb-4">
					<PageHeader
						title={t("navigation.menu.evaluations.recommendations.label")}
						description={t("navigation.description.index", {
							page: t("navigation.menu.evaluations.recommendations.label"),
						})}
						action={{
							type: "back",
							url: "/evaluations/recommendations",
							resourceName: student?.name,
						}}
					/>
					<CardContent>
						<div className="flex flex-col md:flex-row gap-10 w-full mb-4">
							<div className="w-full md:w-[360px] shrink-0">
								<StudentProfileCard student={student} />
							</div>
							<div className="flex-1 w-full">
								<Card>
									<PageHeader
										title="Informasi Akademik Mahasiswa"
										description="Menampilkan ringkasan informasi akademik dan riwayat perkuliahan mahasiswa"
										icon={<GraduationCap />}
									/>
									<CardContent></CardContent>
								</Card>
							</div>
						</div>

						<Card>
							<PageHeader
								title={t("navigation.menu.evaluations.recommendations.show")}
								description={t("navigation.description.show", {
									page: t("navigation.menu.evaluations.recommendations.label"),
								})}
								action={{
									type: "create",
									url: `/evaluations/recommendations/${student?.uuid}/create`,
									permission: Permission.RecommendationCreate,
								}}
							/>
							<CardContent>
								<div className="relative p-1">
									{/* Filter */}
									<div className="flex flex-col sm:flex-row gap-2 items-end">
										<div className="w-full sm:w-[280px]">
											<Label className="block text-sm font-medium mb-2">
												{t("input.filter.page", {
													page: t("input.common.recommendation_note.label"),
												})}
											</Label>
											<DynamicSelectRS
												value={recommendationNoteFilter}
												onChange={setRecommendationNoteFilter}
												options={getRecommendationNoteOptions()}
												placeholder={t("input.select")}
											/>
										</div>

										<div className="w-full sm:w-[280px]">
											<Label className="block text-sm font-medium mb-2">
												{t("input.filter.page", {
													page: t("input.common.semester.label"),
												})}
											</Label>
											<DynamicSelectRS
												value={semesterFilter}
												onChange={setSemesterFilter}
												options={getSemesterOptions()}
												placeholder={t("input.select")}
											/>
										</div>
									</div>

									{/* DataTable Recommendation */}
									<DataTable<Recommendation>
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
										showSelection={hasPermission(
											Permission.RecommendationDelete
										)}
										onBulkDelete={
											hasPermission(Permission.RecommendationDelete)
												? handleBulkDelete
												: undefined
										}
										isLoading={isLoading}
										actionPermissions={{
											show: Permission.RecommendationShow,
											edit: Permission.RecommendationEdit,
											delete: Permission.RecommendationDelete,
										}}
									/>
								</div>
							</CardContent>
						</Card>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default RecommendationShowPage;
