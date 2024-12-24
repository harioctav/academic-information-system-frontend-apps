"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { VillageDialog } from "@/components/pages/locations/villages/village-dialog";
import { VillageShowDialog } from "@/components/pages/locations/villages/village-show-dialog";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { CustomFormatter } from "@/components/ui/async-select-formatter";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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

	const columns = createColumns(
		fetchData,
		handleEdit,
		handleShow
	) as ColumnDef<Village>[];

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
							onClick: handleCreate,
							permission: Permission.VillageCreate,
						}}
					/>
					<CardContent>
						<div className="relative p-1 mt-0">
							{/* Filter */}
							<div className="flex flex-col sm:flex-row gap-2">
								<div className="w-full sm:w-[280px]">
									<Label className="block text-sm font-medium mb-2">
										{t("input.filter.page", {
											page: t("input.district_name.label"),
										})}
									</Label>
									<AsyncSelectInput<District>
										placeholder={t("input.select")}
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
										textFormatter={(item) => (
											<CustomFormatter
												mainText={item.name}
												subText={`${item.regency.type} ${item.regency.name}`}
											/>
										)}
										isClearable
									/>
								</div>
							</div>

							{/* DataTable */}
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
								actionPermissions={{
									show: Permission.VillageShow,
									edit: Permission.VillageEdit,
									delete: Permission.VillageDelete,
								}}
							/>
						</div>
					</CardContent>
				</Card>
			</div>

			<VillageDialog
				isOpen={isDialogOpen}
				onClose={() => {
					setIsDialogOpen(false);
					setSelectedUuid(undefined);
				}}
				uuid={selectedUuid}
				onSuccess={fetchData}
			/>

			<VillageShowDialog
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
