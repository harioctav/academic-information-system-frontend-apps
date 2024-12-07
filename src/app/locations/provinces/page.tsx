"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { ProvinceDialog } from "@/components/pages/locations/provinces/province-dialog";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Permission } from "@/config/enums/permission.enum";
import { useProvinceColumns } from "@/hooks/columns/locations/use-province-column";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useDataTable } from "@/hooks/use-datatable";
import { provinceService } from "@/lib/services/locations/province.service";
import { Province } from "@/types/locations/province";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function ProvincePage() {
	const t = useTranslations();
	const { hasPermission } = usePermissions();

	// Dialog Setup
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedUuid, setSelectedUuid] = useState<string | undefined>();

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
	} = useDataTable<Province>(provinceService.getProvinces);

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
			const response = await provinceService.bulkDeleteProvinces(selectedIds);
			toast.success(response.message);
			fetchData();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "An error occurred");
		}
	};

	const createColumns = useProvinceColumns();
	const columns = createColumns(fetchData, handleEdit) as ColumnDef<Province>[];

	return (
		<MainLayout>
			<div className="w-full">
				<Card>
					<PageHeader
						title={t("navigation.menu.locations.provinces.label")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "create",
							onClick: handleCreate,
						}}
					/>
					<CardContent>
						<div className="relative p-1 mt-0">
							<DataTable<Province>
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
								showSelection={hasPermission(Permission.ProvinceDelete)}
								onBulkDelete={
									hasPermission(Permission.ProvinceDelete)
										? handleBulkDelete
										: undefined
								}
								isLoading={isLoading}
							/>
						</div>
					</CardContent>
				</Card>
			</div>

			<ProvinceDialog
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
