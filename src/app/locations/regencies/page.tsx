"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { RegencyDialog } from "@/components/pages/locations/regencies/regency-dialog";
import RegencyShowDialog from "@/components/pages/locations/regencies/regency-show-dialog";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicSelect } from "@/components/ui/dynamic-select";
import { Label } from "@/components/ui/label";
import { Permission } from "@/config/enums/permission.enum";
import { RegencyType } from "@/config/enums/regency.type.enum";
import { useRegencyColumns } from "@/hooks/columns/locations/use-regency-column";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useDataTable } from "@/hooks/use-datatable";
import { regencyService } from "@/lib/services/locations/regency.service";
import { Province } from "@/types/locations/province";
import { Regency } from "@/types/locations/regency";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function RegencyPage() {
	const t = useTranslations();
	const { hasPermission } = usePermissions();

	// Filter
	const [selectedProvince, setSelectedProvince] =
		useState<SelectOption<Province> | null>(null);
	const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

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

	const regencyTypeOptions = [
		{ value: RegencyType.Kota, label: RegencyType.Kota },
		{ value: RegencyType.Kabupaten, label: RegencyType.Kabupaten },
	];

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
	} = useDataTable<Regency>(regencyService.getRegencies, {
		filters: {
			type: typeFilter !== "all" ? typeFilter : undefined,
			province_id: selectedProvince?.value,
		},
	});

	const createColumns = useRegencyColumns();

	const columns = createColumns(
		fetchData,
		handleEdit,
		handleShow
	) as ColumnDef<Regency>[];

	const handleBulkDelete = async (selectedIds: string[]) => {
		try {
			const response = await regencyService.bulkDeleteRegencies(selectedIds);
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
						title={t("navigation.menu.locations.regencies.label")}
						description={t("navigation.description.index", {
							page: t("navigation.menu.locations.regencies.label"),
						})}
						action={{
							type: "create",
							onClick: handleCreate,
							permission: Permission.RegencyCreate,
						}}
					/>
					<CardContent>
						<div className="relative p-1 mt-0">
							{/* Filter */}
							<div className="flex flex-col sm:flex-row gap-2">
								<div className="w-full sm:w-[280px]">
									<Label className="block text-sm font-medium mb-2">
										{t("input.filter.type")}
									</Label>
									<DynamicSelect
										value={typeFilter}
										onChange={setTypeFilter}
										options={regencyTypeOptions}
										placeholder={t("input.select")}
									/>
								</div>
								<div className="w-full sm:w-[280px]">
									<Label className="block text-sm font-medium mb-2">
										{t("input.filter.page", {
											page: t("input.province_name.label"),
										})}
									</Label>
									<AsyncSelectInput<Province>
										placeholder={t("input.select")}
										apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/options/locations/provinces`}
										value={selectedProvince}
										onChange={(newValue) => {
											setSelectedProvince(newValue);
											setPagination({ ...pagination, pageIndex: 0 });
										}}
										onClear={() => {
											setSelectedProvince(null);
											setPagination({ ...pagination, pageIndex: 0 });
										}}
										textFormatter={(item) => item.name}
										isClearable
									/>
								</div>
							</div>

							{/* DataTable */}
							<DataTable<Regency>
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
								showSelection={hasPermission(Permission.RegencyDelete)}
								onBulkDelete={
									hasPermission(Permission.RegencyDelete)
										? handleBulkDelete
										: undefined
								}
								isLoading={isLoading}
								actionPermissions={{
									show: Permission.RegencyShow,
									edit: Permission.RegencyEdit,
									delete: Permission.RegencyDelete,
								}}
							/>
						</div>
					</CardContent>
				</Card>
			</div>

			<RegencyDialog
				isOpen={isDialogOpen}
				onClose={() => {
					setIsDialogOpen(false);
					setSelectedUuid(undefined);
				}}
				uuid={selectedUuid}
				onSuccess={fetchData}
			/>

			<RegencyShowDialog
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
