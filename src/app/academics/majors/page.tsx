"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { MajorDialog } from "@/components/pages/academics/majors/major-dialog";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicSelect } from "@/components/forms/dynamic-select";
import { Label } from "@/components/ui/label";
import { getDegreeOptions } from "@/config/enums/degree.type.enum";
import { Permission } from "@/config/enums/permission.enum";
import { useMajorColumns } from "@/hooks/columns/academics/use-major-column";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useDataTable } from "@/hooks/use-datatable";
import { majorService } from "@/lib/services/academics/major.service";
import { Major } from "@/types/academics/major";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function MajorPage() {
	const t = useTranslations();
	const { hasPermission } = usePermissions();

	// Dialog Setup
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedUuid, setSelectedUuid] = useState<string | undefined>();

	// Setup Filter
	const [degreeFilter, setDegreeFilter] = useState<string | undefined>(
		undefined
	);

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
	} = useDataTable<Major>(majorService.getMajors, {
		filters: {
			degree: degreeFilter !== "all" ? degreeFilter : undefined,
		},
	});

	const handleCreate = () => {
		setSelectedUuid(undefined);
		setIsDialogOpen(true);
	};

	const handleEdit = (uuid: string) => {
		setSelectedUuid(uuid);
		setIsDialogOpen(true);
	};

	const handleBulkDelete = async (selectedIds: string[]) => {
		try {
			const response = await majorService.bulkDeleteMajors(selectedIds);
			toast.success(response.message);
			await fetchData();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "An error occurred");
		}
	};

	const createColumns = useMajorColumns();
	const columns = createColumns(fetchData, handleEdit) as ColumnDef<Major>[];

	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.academics.majors.label")}
						description={t("navigation.description.index", {
							page: t("navigation.menu.academics.majors.label"),
						})}
						action={{
							type: "create",
							onClick: handleCreate,
							permission: Permission.MajorCreate,
						}}
					/>
					<CardContent>
						<div className="relative p-1 mt-0">
							<div className="flex flex-col sm:flex-row gap-2">
								<div className="w-full sm:w-[280px]">
									<Label className="block text-sm font-medium mb-2">
										{t("input.filter.page", {
											page: t("input.common.degree.label"),
										})}
									</Label>
									<DynamicSelect
										value={degreeFilter}
										onChange={setDegreeFilter}
										options={getDegreeOptions()}
										placeholder={t("input.select")}
									/>
								</div>
							</div>

							<DataTable<Major>
								isSpecialRow={(row) => row.total_course_credit > 0}
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
								showSelection={hasPermission(Permission.MajorDelete)}
								onBulkDelete={
									hasPermission(Permission.MajorDelete)
										? handleBulkDelete
										: undefined
								}
								isLoading={isLoading}
								actionPermissions={{
									show: Permission.MajorShow,
									edit: Permission.MajorEdit,
									delete: Permission.MajorDelete,
								}}
							/>
						</div>
					</CardContent>
				</Card>
			</div>

			<MajorDialog
				isOpen={isDialogOpen}
				onClose={() => {
					setIsDialogOpen(false);
					setSelectedUuid(undefined);
				}}
				uuid={selectedUuid}
				onSuccess={fetchData}
			/>
		</MainLayout>
	);
}
