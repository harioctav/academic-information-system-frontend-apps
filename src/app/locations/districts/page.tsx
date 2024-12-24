"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { DistrictDialog } from "@/components/pages/locations/districts/distirct-dialog";
import DistrictShowDialog from "@/components/pages/locations/districts/district-show-dialog";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Permission } from "@/config/enums/permission.enum";
import { useDistrictColumns } from "@/hooks/columns/locations/use-district-column";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useDataTable } from "@/hooks/use-datatable";
import { districtService } from "@/lib/services/locations/district.service";
import { District } from "@/types/locations/district";
import { Regency } from "@/types/locations/regency";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function HomePage() {
	const t = useTranslations();
	const { hasPermission } = usePermissions();

	// Filter
	const [selectedRegency, setSelectedRegency] =
		useState<SelectOption<Regency> | null>(null);

	// Add dialog state
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedUuid, setSelectedUuid] = useState<string | undefined>();

	const [isShowDialogOpen, setIsShowDialogOpen] = useState(false);

	const handleCreate = () => {
		setSelectedUuid(undefined);
		setIsDialogOpen(true);
	};

	const handleEdit = (uuid: string) => {
		setSelectedUuid(uuid);
		setIsDialogOpen(true);
	};

	const handleShow = (uuid: string) => {
		setSelectedUuid(uuid);
		setIsShowDialogOpen(true);
	};

	const {
		data,
		pageCount,
		pagination,
		sorting,
		searchQuery,
		isLoading,
		setPagination,
		setSorting,
		setSearchQuery,
		fetchData,
	} = useDataTable<District>(districtService.getDistricts, {
		filters: {
			regency_id: selectedRegency?.value,
		},
	});

	const createColumns = useDistrictColumns();

	const columns = createColumns(
		fetchData,
		handleEdit,
		handleShow
	) as ColumnDef<District>[];

	const handleBulkDelete = async (selectedIds: string[]) => {
		try {
			const response = await districtService.bulkDeleteDistricts(selectedIds);
			toast.success(response.message);
			fetchData();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "An error occurred");
		}
	};

	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.locations.districts.label")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "create",
							onClick: handleCreate,
							permission: Permission.DistrictCreate,
						}}
					></PageHeader>
					<CardContent>
						<div className="relative p-1 mt-0">
							{/* Filter */}
							<div className="flex flex-col sm:flex-row gap-2">
								<div className="w-full sm:w-[380px]">
									<Label className="block text-sm font-medium mb-2">
										{t("input.filter.page", {
											page: t("input.regency_name.label"),
										})}
									</Label>
									<AsyncSelectInput<Regency>
										placeholder={t("input.select")}
										apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/locations/regencies`}
										value={selectedRegency}
										onChange={(newValue) => {
											setSelectedRegency(newValue);
											setPagination({ ...pagination, pageIndex: 0 });
										}}
										onClear={() => {
											setSelectedRegency(null);
											setPagination({ ...pagination, pageIndex: 0 });
										}}
										textFormatter={(item) => `${item.type} ${item.name}`}
										isClearable
									/>
								</div>
							</div>

							{/* Table */}
							<DataTable<District>
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
								showSelection={hasPermission(Permission.DistrictEdit)}
								onBulkDelete={
									hasPermission(Permission.DistrictDelete)
										? handleBulkDelete
										: undefined
								}
								isLoading={isLoading}
								actionPermissions={{
									show: Permission.DistrictShow,
									edit: Permission.DistrictEdit,
									delete: Permission.DistrictDelete,
								}}
							/>
						</div>
					</CardContent>
				</Card>
			</div>

			<DistrictDialog
				isOpen={isDialogOpen}
				onClose={() => {
					setIsDialogOpen(false);
					setSelectedUuid(undefined);
				}}
				uuid={selectedUuid}
				onSuccess={fetchData}
			/>

			<DistrictShowDialog
				isOpen={isShowDialogOpen}
				onClose={() => {
					setIsShowDialogOpen(false);
					setSelectedUuid(undefined);
				}}
				uuid={selectedUuid}
			/>
		</MainLayout>
	);
}
