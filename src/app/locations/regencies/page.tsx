"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Permission } from "@/config/enums/permission.enum";
import { useRegencyColumns } from "@/hooks/columns/locations/use-regency-column";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useDataTable } from "@/hooks/use-datatable";
import { regencyService } from "@/lib/services/locations/regency.service";
import { Regency } from "@/types/locations/regency";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function RegencyPage() {
	const t = useTranslations();
	const { hasPermission } = usePermissions();
	const createColumns = useRegencyColumns();

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
	} = useDataTable<Regency>(regencyService.getRegencies);

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
					/>
					<CardContent>
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
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
}
