"use client";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { ActionColumn } from "@/components/tables/partials/action-column";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Permission } from "@/config/enums/permission.enum";
import { getRoleLabel, UserRole } from "@/config/enums/role.enum";
import { roleService } from "@/lib/services/settings/role.service";
import { Role } from "@/types/settings/role";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export const useRoleColumns = () => {
	const t = useTranslations();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

	const handleDelete = async (uuid: string, onSuccess: () => void) => {
		try {
			const response = await roleService.deleteRole(uuid);
			toast.success(response.message);
			onSuccess();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "An error occurred");
		} finally {
			setIsDeleteDialogOpen(false);
			setSelectedUuid(null);
		}
	};

	const createColumns = (refreshData: () => void) => {
		const columns: ColumnDef<Role>[] = [
			{
				accessorKey: "name",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="w-full"
						>
							{t("input.common.name.label")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => getRoleLabel(row.original.name),
			},
			{
				accessorKey: "permissions_total",
				header: t("input.meta.permissions_total.label"),
				cell: ({ row }) => (
					<div className="flex justify-center">
						<Badge variant="green">{row.original.permissions_total}</Badge>
					</div>
				),
			},
			{
				accessorKey: "users_total",
				header: t("input.meta.users_total.label"),
				cell: ({ row }) => (
					<div className="flex justify-center">
						<Badge variant="blue">{row.original.users_total}</Badge>
					</div>
				),
			},
			{
				accessorKey: "created_at",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="w-full"
						>
							{t("input.meta.created_at.label")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => row.original.created_at.formatted,
				enableHiding: true,
			},
			{
				accessorKey: "updated_at",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="w-full"
						>
							{t("input.meta.updated_at.label")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => row.original.updated_at.formatted,
				enableHiding: true,
			},
			{
				id: "actions",
				header: () => (
					<div className="flex justify-center">
						<Settings2 className="h-4 w-4" />
					</div>
				),
				cell: ({ row }) => {
					return (
						<>
							<ActionColumn
								editUrl={`/settings/roles/edit/${row.original.uuid}`}
								editPermission={Permission.RoleEdit}
								deletePermission={Permission.RoleDelete}
								onDelete={() => {
									setSelectedUuid(row.original.uuid);
									setIsDeleteDialogOpen(true);
								}}
								conditions={[
									// Hide both edit and delete for super_admin
									{
										key: "super_admin",
										value: row.original.name === UserRole.SuperAdmin,
										hideEdit: true,
										hideDelete: true,
									},
									// Hide delete button if users exist
									{
										key: "has_users",
										value: row.original.users_total > 0,
										hideDelete: true,
									},
									// Add more conditions as needed
									// {
									//   key: 'is_active',
									//   value: !row.original.is_active,
									//   hideEdit: true,
									//   hideDelete: true
									// }
								]}
							/>

							<ConfirmationDialog
								isOpen={
									isDeleteDialogOpen && selectedUuid === row.original.uuid
								}
								onClose={() => {
									setIsDeleteDialogOpen(false);
									setSelectedUuid(null);
								}}
								onConfirm={() => handleDelete(row.original.uuid, refreshData)}
								title={t("navigation.menu.settings.roles.delete")}
								description={t("dialog.delete.description", {
									page: t("navigation.menu.settings.roles.label"),
								})}
								confirmText={t("button.common.delete")}
								cancelText={t("button.common.cancel")}
							/>
						</>
					);
				},
			},
		];

		return columns;
	};

	return createColumns;
};
