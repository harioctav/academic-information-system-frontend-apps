"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Permission } from "@/config/enums/permission.enum";
import { useUserColumns } from "@/hooks/columns/settings/use-user-column";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useDataTable } from "@/hooks/use-datatable";
import { userService } from "@/lib/services/settings/user.service";
import { User } from "@/types/settings/user";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function HomePage() {
	const t = useTranslations();
	const { hasPermission } = usePermissions();
	const createColumns = useUserColumns();

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
	} = useDataTable<User>(userService.getUsers);

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
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
}
