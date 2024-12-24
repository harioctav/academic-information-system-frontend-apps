"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import UserShowDialog from "@/components/pages/settings/users/user-show-dialog";
import { DataTable } from "@/components/tables/data-table";
import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicSelect } from "@/components/ui/dynamic-select";
import { Label } from "@/components/ui/label";
import { Permission } from "@/config/enums/permission.enum";
import { getRoleLabel } from "@/config/enums/role.enum";
import { getStatusOptions } from "@/config/enums/status.enum";
import { useUserColumns } from "@/hooks/columns/settings/use-user-column";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useDataTable } from "@/hooks/use-datatable";
import { useAuth } from "@/lib/auth/auth-provider";
import { userService } from "@/lib/services/settings/user.service";
import { Role } from "@/types/settings/role";
import { User } from "@/types/settings/user";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function UserPage() {
	const t = useTranslations();
	const { user } = useAuth();
	const { hasPermission } = usePermissions();
	const createColumns = useUserColumns();

	// Setup Filter
	const [statusFilter, setStatusFilter] = useState<string | undefined>(
		undefined
	);
	const [selectedRole, setSelectedRole] = useState<SelectOption<Role> | null>(
		null
	);

	const [isShowDialogOpen, setIsShowDialogOpen] = useState(false);
	const [selectedUuid, setSelectedUuid] = useState<string | undefined>();

	const handleShow = (uuid: string) => {
		setSelectedUuid(uuid);
		setIsShowDialogOpen(true);
	};

	const statusOptions = getStatusOptions(t);

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
			status: statusFilter !== "all" ? statusFilter : undefined,
		},
	});

	const columns = createColumns(fetchData, handleShow) as ColumnDef<User>[];

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
						action={{
							type: "create",
							url: "/settings/users/create",
							permission: Permission.UserCreate,
						}}
					/>
					<CardContent>
						<div className="flex flex-col sm:flex-row gap-2">
							<div className="w-full sm:w-[280px]">
								<Label className="block text-sm font-medium mb-2">
									{t("input.filter.page", {
										page: t("input.user.roles.label"),
									})}
								</Label>
								<AsyncSelectInput<Role>
									placeholder={t("input.select")}
									apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/options/roles`}
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
							<div className="w-full sm:w-[280px]">
								<Label className="block text-sm font-medium mb-2">
									{t("input.filter.page", {
										page: t("input.common.status.label"),
									})}
								</Label>
								<DynamicSelect
									value={statusFilter}
									onChange={setStatusFilter}
									options={statusOptions}
									placeholder={t("input.select")}
								/>
							</div>
						</div>
						<div className="relative p-1 mt-0">
							<DataTable<User>
								isSpecialRow={(row) =>
									row.status == 1 || row.uuid === user?.uuid
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
								showSelection={hasPermission(Permission.UserDelete)}
								onBulkDelete={
									hasPermission(Permission.UserDelete)
										? handleBulkDelete
										: undefined
								}
								isLoading={isLoading}
								actionPermissions={{
									show: Permission.UserShow,
									edit: Permission.UserEdit,
									delete: Permission.UserDelete,
								}}
							/>
						</div>
					</CardContent>
				</Card>
			</div>

			<UserShowDialog
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
