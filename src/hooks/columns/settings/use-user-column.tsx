"use client";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { ActionColumn } from "@/components/tables/partials/action-column";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Permission } from "@/config/enums/permission.enum";
import { getRoleBadgeVariant, getRoleLabel } from "@/config/enums/role.enum";
import {
	getStatusBadgeVariant,
	getStatusLabel,
} from "@/config/enums/status.enum";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useAuth } from "@/lib/auth/auth-provider";
import { userService } from "@/lib/services/settings/user.service";
import { User } from "@/types/settings/user";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export const useUserColumns = () => {
	// setup
	const t = useTranslations();
	const { user } = useAuth();
	const { hasPermission } = usePermissions();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
	const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

	const handleDelete = async (uuid: string, onSuccess: () => void) => {
		try {
			const response = await userService.deleteUser(uuid);
			toast.success(response.message);
			onSuccess();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "An error occurred");
		} finally {
			setIsDeleteDialogOpen(false);
			setSelectedUuid(null);
		}
	};

	const handleStatusChange = async (uuid: string, onSuccess: () => void) => {
		try {
			const response = await userService.changeUserStatus(uuid);
			toast.success(response.message);
			onSuccess();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "An error occurred");
		} finally {
			setIsStatusDialogOpen(false);
			setSelectedUuid(null);
		}
	};

	const createColumns = (
		refreshData: () => void,
		onShow?: (uuid: string) => void
	) => {
		const columns: ColumnDef<User>[] = [
			{
				accessorKey: "photo_url",
				header: t("input.user.photo.label"),
				cell: ({ row }) => {
					const user = row.original;
					return (
						<Avatar className="h-8 w-8 circle">
							<AvatarImage src={user.photo_url || undefined} alt={user.name} />
							<AvatarFallback className="circle">
								{user.name.substring(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
					);
				},
			},

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
			},
			{
				accessorKey: "email",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="w-full"
						>
							{t("input.user.email.label")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
			},
			{
				accessorKey: "phone",
				header: t("input.user.phone.label"),
				cell: ({ row }) => {
					return row.original.phone || "-";
				},
			},
			{
				accessorKey: "status",
				header: t("input.common.status.label"),
				cell: ({ row }) => {
					return (
						<>
							<Badge
								variant={getStatusBadgeVariant(row.original.status)}
								className="cursor-pointer"
								onClick={() => {
									if (hasPermission(Permission.UserStatus)) {
										setSelectedUuid(row.original.uuid);
										setIsStatusDialogOpen(true);
									}
								}}
							>
								{getStatusLabel(row.original.status, t)}
							</Badge>

							{hasPermission(Permission.UserStatus) && (
								<ConfirmationDialog
									isOpen={
										isStatusDialogOpen && selectedUuid === row.original.uuid
									}
									onClose={() => {
										setIsStatusDialogOpen(false);
										setSelectedUuid(null);
									}}
									onConfirm={() =>
										handleStatusChange(row.original.uuid, refreshData)
									}
									title={t("dialog.status.title")}
									description={t("dialog.status.description")}
									confirmText={t("button.common.continue")}
									cancelText={t("button.common.cancel")}
								/>
							)}
						</>
					);
				},
			},
			{
				accessorKey: "roles",
				header: t("input.user.roles.label"),
				cell: ({ row }) => {
					const roles = row.original.roles;
					if (!roles || roles.length == 0) return "-";

					return (
						<>
							{roles.map((role, index) => (
								<Badge key={index} variant={getRoleBadgeVariant(role.name)}>
									{getRoleLabel(role.name)}
								</Badge>
							))}
						</>
					);
				},
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
								editUrl={`/settings/users/edit/${row.original.uuid}`}
								onShow={() => onShow?.(row.original.uuid)}
								showPermission={Permission.UserShow}
								editPermission={Permission.UserEdit}
								deletePermission={Permission.UserDelete}
								onDelete={() => {
									setSelectedUuid(row.original.uuid);
									setIsDeleteDialogOpen(true);
								}}
								conditions={[
									{
										key: "is_active",
										value: row.original.status == 1,
										hideDelete: true,
									},
									{
										key: "is_current_user",
										value: row.original.uuid === user?.uuid,
										hideShow: true,
										hideDelete: true,
										hideEdit: true,
									},
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
								title={t("navigation.menu.settings.users.delete")}
								description={t("dialog.delete.description", {
									page: t("navigation.menu.settings.users.label"),
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
