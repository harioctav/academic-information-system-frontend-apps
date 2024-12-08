"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicSelect } from "@/components/ui/dynamic-select";
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
	const createColumns = useRegencyColumns();

	// Filter
	const [selectedProvince, setSelectedProvince] =
		useState<SelectOption<Province> | null>(null);
	const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

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

	const columns = createColumns(fetchData) as ColumnDef<Regency>[];

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
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "create",
							url: "/locations/regencies/create",
							permission: Permission.RegencyCreate,
						}}
					/>
					<CardContent>
						<div className="flex flex-col sm:flex-row gap-2 mb-4">
							<div className="w-full sm:w-[280px]">
								<DynamicSelect
									value={typeFilter}
									onChange={setTypeFilter}
									options={regencyTypeOptions}
									placeholder={t("input.filter.type")}
								/>
							</div>
							<div className="w-full sm:w-[280px]">
								<AsyncSelectInput<Province>
									placeholder={t("input.filter.page", {
										page: t("input.province_name.label"),
									})}
									apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/locations/provinces`}
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
						<div className="relative p-1 mt-0">
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
									edit: Permission.RegencyEdit,
									delete: Permission.RegencyDelete,
								}}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
}
