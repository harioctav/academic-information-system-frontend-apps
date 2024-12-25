"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Permission } from "@/config/enums/permission.enum";
import { UserRole } from "@/config/enums/role.enum";
import { useRoleColumns } from "@/hooks/columns/settings/use-role-column";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useDataTable } from "@/hooks/use-datatable";
import { roleService } from "@/lib/services/settings/role.service";
import { Role } from "@/types/settings/role";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function RolePage() {
	const t = useTranslations();

	const { hasPermission } = usePermissions();
	const createColumns = useRoleColumns();

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
	} = useDataTable<Role>(roleService.getRoles);

	const columns = createColumns(fetchData) as ColumnDef<Role>[];

	const handleBulkDelete = async (selectedIds: string[]) => {
		try {
			const response = await roleService.bulkDeleteRoles(selectedIds);
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
						title={t("navigation.menu.settings.roles.label")}
						description={t("navigation.description.index", {
							page: t("navigation.menu.settings.roles.label"),
						})}
					/>
					<CardContent>
						<div className="relative p-1 mt-0">
							<DataTable<Role>
								isSpecialRow={(row) =>
									row.name === UserRole.SuperAdmin || row.users_total > 0
								}
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
								showSelection={hasPermission(Permission.RoleEdit)}
								onBulkDelete={
									hasPermission(Permission.RoleDelete)
										? handleBulkDelete
										: undefined
								}
								isLoading={isLoading}
								actionPermissions={{
									show: Permission.RoleShow,
									edit: Permission.RoleEdit,
									delete: Permission.RoleDelete,
								}}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
}
