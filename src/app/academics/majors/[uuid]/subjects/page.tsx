"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DynamicSelect } from "@/components/ui/dynamic-select";
import { Label } from "@/components/ui/label";
import ListContainer from "@/components/ui/list-container";
import { ListItem } from "@/components/ui/list-item";
import { LoadingPage } from "@/components/ui/loading-page";
import { getDegreeLabel } from "@/config/enums/degree.type.enum";
import { Permission } from "@/config/enums/permission.enum";
import { getSemesterOptions } from "@/config/enums/semester.enum";
import { useMajorSubjectColumns } from "@/hooks/columns/academics/use-major-subject-column";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useDataTable } from "@/hooks/use-datatable";
import { majorService } from "@/lib/services/academics/major.service";
import { majorSubjectService } from "@/lib/services/academics/major.subject.service";
import { Major } from "@/types/academics/major";
import { MajorSubject } from "@/types/academics/major.subject";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function MajorSubjectPage({
	params,
}: {
	params: Promise<{ uuid: string }>;
}) {
	const t = useTranslations();
	const { hasPermission } = usePermissions();
	const resolvedParams = use(params);
	const [major, setMajor] = useState<Major | null>(null);
	const [totalCredits, setTotalCredits] = useState<number>(0);
	const [semesterFilter, setSemesterFilter] = useState<string | undefined>(
		undefined
	);

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
	} = useDataTable<MajorSubject>(
		(params) =>
			majorSubjectService.getMajorSubjects(resolvedParams.uuid, params),
		{
			filters: {
				semester: semesterFilter !== "all" ? semesterFilter : undefined,
			},
		}
	);

	useEffect(() => {
		const fetchMajorData = async () => {
			const response = await majorService.showMajor(resolvedParams.uuid);
			setMajor(response.data);
			setTotalCredits(response.data.total_course_credit);
		};

		fetchMajorData();
	}, [resolvedParams.uuid]);

	useEffect(() => {
		const update = async () => {
			const response = await majorService.showMajor(resolvedParams.uuid);
			setTotalCredits(response.data.total_course_credit);
		};

		if (data) {
			update();
		}
	}, [data, resolvedParams.uuid]);

	const handleBulkDelete = async (selectedIds: string[]) => {
		try {
			const response = await majorSubjectService.bulkDeleteMajorSubjects(
				selectedIds,
				resolvedParams.uuid
			);
			toast.success(response.message);
			await fetchData();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "An error occurred");
		}
	};

	const createColumns = useMajorSubjectColumns();
	const columns = createColumns(fetchData) as ColumnDef<MajorSubject>[];

	if (!major) {
		return <LoadingPage />;
	}

	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.academics.majors.subjects.label")}
						description="Major subjects management"
						action={{
							type: "back",
							url: "/academics/majors",
							resourceName: major?.name,
						}}
					/>
					<CardContent>
						<div className="relative p-1 mt-0">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<Card className="w-full">
									<CardHeader>
										<CardTitle>Detail Program Studi {major?.name}</CardTitle>
										<CardDescription>
											Lorem ipsum dolor sit amet consectetur adipisicing elit.
											Obcaecati, quia.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<ListContainer>
											<ListItem label="Kode" value={major?.code} />
											<ListItem label="Program Studi" value={major?.name} />
											<ListItem
												label="Jenjang atau Tingkatan"
												value={getDegreeLabel(major?.degree)}
											/>
											<ListItem
												label="Jumlah SKS Wajib Tempuh"
												value={totalCredits.toString()}
											/>
										</ListContainer>
									</CardContent>
								</Card>
							</div>

							<div className="flex flex-col sm:flex-row gap-2">
								<div className="w-full sm:w-[280px]">
									<Label className="block text-sm font-medium mb-2">
										{t("input.filter.page", {
											page: t("input.common.semester.label"),
										})}
									</Label>
									<DynamicSelect
										value={semesterFilter}
										onChange={setSemesterFilter}
										options={getSemesterOptions()}
										placeholder={t("input.select")}
									/>
								</div>
							</div>

							<DataTable<MajorSubject>
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
								showSelection={hasPermission(Permission.MajorSubjectDelete)}
								onBulkDelete={
									hasPermission(Permission.MajorSubjectDelete)
										? handleBulkDelete
										: undefined
								}
								isLoading={isLoading}
								actionPermissions={{
									edit: Permission.MajorSubjectEdit,
									delete: Permission.MajorSubjectDelete,
								}}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
}
