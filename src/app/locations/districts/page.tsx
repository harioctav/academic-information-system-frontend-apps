"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { Card, CardContent } from "@/components/ui/card";
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
	const createColumns = useDistrictColumns();

	// Filter
	const [selectedRegency, setSelectedRegency] =
		useState<SelectOption<Regency> | null>(null);

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
	} = useDataTable<District>(districtService.getDistricts, {
		filters: {
			regency_id: selectedRegency?.value,
		},
	});

	const columns = createColumns(fetchData) as ColumnDef<District>[];

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
							url: "/locations/districts/create",
						}}
					></PageHeader>
					<CardContent>
						<div className="flex flex-col sm:flex-row gap-2 mb-4">
							<div className="w-full sm:w-[280px]">
								<AsyncSelectInput<Regency>
									placeholder={t("input.filter.page", {
										page: t("input.regency_name.label"),
									})}
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
						<div className="relative p-1 mt-0">
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
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
}
