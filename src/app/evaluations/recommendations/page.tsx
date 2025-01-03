"use client";

import { DynamicSelectRS } from "@/components/forms/dynamic-select-react";
import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getStatusRegistrationOptions } from "@/config/enums/status.registration.enum";
import { useRecommendationStudentColumns } from "@/hooks/columns/evaluations/use.recommendation.student.column";
import { useDataTable } from "@/hooks/use-datatable";
import { recommendationService } from "@/lib/services/evaluations/recommendation.service";
import { Major } from "@/types/academics/major";
import { Student } from "@/types/academics/student";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function RecommendationPage() {
	const t = useTranslations();
	const createColumns = useRecommendationStudentColumns();

	/** Filter Dropdown */
	const [selectedMajor, setSelectedMajor] =
		useState<SelectOption<Major> | null>(null);
	const [statusRegisFilter, setStatusRegisFilter] = useState<
		string | undefined
	>(undefined);

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
	} = useDataTable<Student>(recommendationService.getRecommendations, {
		filters: {
			major_id: selectedMajor?.data.id,
			status_registration:
				statusRegisFilter !== "all" ? statusRegisFilter : undefined,
		},
	});

	/** Setup Columns */
	const columns = createColumns() as ColumnDef<Student>[];

	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.academics.students.label")}
						description={t("navigation.description.index", {
							page: t("navigation.menu.academics.students.label"),
						})}
					/>
					<CardContent>
						<div className="relative p-1 mt-0">
							<div className="flex flex-col sm:flex-row gap-2">
								{/* Filter By Major */}
								<div className="w-full sm:w-[280px]">
									<Label className="block text-sm font-medium mb-2">
										{t("input.filter.page", {
											page: t("module.academic.majors"),
										})}
									</Label>
									<AsyncSelectInput<Major>
										placeholder={t("input.select")}
										apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/options/academics/majors`}
										value={selectedMajor}
										onChange={(newValue) => {
											setSelectedMajor(newValue);
											setPagination({ ...pagination, pageIndex: 0 });
										}}
										onClear={() => {
											setSelectedMajor(null);
											setPagination({ ...pagination, pageIndex: 0 });
										}}
										textFormatter={(item) => item.name}
										valueFormatter={(item) => item.name}
										isClearable
									/>
								</div>
								<div className="w-full sm:w-[280px]">
									<Label className="block text-sm font-medium mb-2">
										{t("input.filter.page", {
											page: t("input.common.status_registration.label"),
										})}
									</Label>
									<DynamicSelectRS
										value={statusRegisFilter}
										onChange={setStatusRegisFilter}
										options={getStatusRegistrationOptions()}
										placeholder={t("input.select")}
									/>
								</div>
							</div>
							{/* DataTable */}
							<DataTable<Student>
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
								showSelection={false}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
}
