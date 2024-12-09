"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { Card, CardContent } from "@/components/ui/card";
import { Permission } from "@/config/enums/permission.enum";
import { getRoleLabel } from "@/config/enums/role.enum";
import { useUserColumns } from "@/hooks/columns/settings/use-user-column";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useDataTable } from "@/hooks/use-datatable";
import { userService } from "@/lib/services/settings/user.service";
import { Role } from "@/types/settings/role";
import { User } from "@/types/settings/user";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function UserPage() {
	const t = useTranslations();
	const { hasPermission } = usePermissions();
	const createColumns = useUserColumns();

	const [selectedRole, setSelectedRole] = useState<SelectOption<Role> | null>(
		null
	);

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
	} = useDataTable<User>(userService.getUsers, {
		filters: {
			roles: selectedRole?.data.name,
		},
	});

	const columns = createColumns(fetchData) as ColumnDef<User>[];

	const handleBulkDelete = async (selectedIds: string[]) => {
		try {
			const response = await userService.bulkDeleteUsers(selectedIds);
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
						title={t("navigation.menu.settings.users.label")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
					/>
					<CardContent>
						<div className="flex flex-col sm:flex-row gap-2">
							<div className="w-full sm:w-[280px]">
								<AsyncSelectInput<Role>
									placeholder={t("input.select")}
									apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/settings/roles`}
									value={selectedRole}
									onChange={(newValue) => {
										setSelectedRole(newValue);
										setPagination({ ...pagination, pageIndex: 0 });
									}}
									onClear={() => {
										setSelectedRole(null);
										setPagination({ ...pagination, pageIndex: 0 });
									}}
									textFormatter={(item) => getRoleLabel(item.name)}
									valueFormatter={(item) => item.name}
									isClearable
								/>
							</div>
						</div>
						<div className="relative p-1 mt-0">
							<DataTable<User>
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
								showSelection={hasPermission(Permission.UserDelete)}
								onBulkDelete={
									hasPermission(Permission.UserDelete)
										? handleBulkDelete
										: undefined
								}
								isLoading={isLoading}
								actionPermissions={{
									edit: Permission.UserEdit,
									delete: Permission.UserDelete,
								}}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
}
