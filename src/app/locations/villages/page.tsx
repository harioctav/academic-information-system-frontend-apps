"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { Card, CardContent } from "@/components/ui/card";
import { Permission } from "@/config/enums/permission.enum";
import { useVillageColumns } from "@/hooks/columns/locations/use-village-column";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useDataTable } from "@/hooks/use-datatable";
import { villageService } from "@/lib/services/locations/village.service";
import { District } from "@/types/locations/district";
import { Village } from "@/types/locations/village";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function VillagePage() {
	const t = useTranslations();
	const { hasPermission } = usePermissions();
	const createColumns = useVillageColumns();

	// Filter
	const [selectedDistrict, setSelectedDistrict] =
		useState<SelectOption<District> | null>(null);

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
	} = useDataTable<Village>(villageService.getVillages, {
		filters: {
			district_id: selectedDistrict?.value,
		},
	});

	const columns = createColumns(fetchData) as ColumnDef<Village>[];

	const handleBulkDelete = async (selectedIds: string[]) => {
		try {
			const response = await villageService.bulkDeleteVillages(selectedIds);
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
						title={t("navigation.menu.locations.villages.label")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "create",
							url: "/locations/villages/create",
						}}
					/>
					<CardContent>
						<div className="flex flex-col sm:flex-row gap-2 mb-4">
							<div className="w-full sm:w-[280px]">
								<AsyncSelectInput<District>
									placeholder={t("input.filter.page", {
										page: t("input.district_name.label"),
									})}
									apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/locations/districts`}
									value={selectedDistrict}
									onChange={(newValue) => {
										setSelectedDistrict(newValue);
										setPagination({ ...pagination, pageIndex: 0 });
									}}
									onClear={() => {
										setSelectedDistrict(null);
										setPagination({ ...pagination, pageIndex: 0 });
									}}
									textFormatter={(item) => item.name}
									isClearable
								/>
							</div>
						</div>
						<div className="relative p-1 mt-0">
							<DataTable<Village>
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
								showSelection={hasPermission(Permission.VillageEdit)}
								onBulkDelete={
									hasPermission(Permission.VillageDelete)
										? handleBulkDelete
										: undefined
								}
								isLoading={isLoading}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
}
