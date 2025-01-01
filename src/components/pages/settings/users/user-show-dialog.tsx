"use client";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { Badge } from "@/components/ui/badge";
import { GridAvatarItem } from "@/components/ui/grid-avatar-item";
import { GridContainer } from "@/components/ui/grid-container";
import { GridItem } from "@/components/ui/grid-item";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getRoleBadgeVariant, getRoleLabel } from "@/config/enums/role.enum";
import {
	getStatusBadgeVariant,
	getStatusLabel,
} from "@/config/enums/status.enum";
import { userService } from "@/lib/services/settings/user.service";
import { ApiError } from "@/types/api";
import { ShowDialogProps } from "@/types/common";
import { User } from "@/types/settings/user";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const UserShowDialog = ({ isOpen, onClose, uuid }: ShowDialogProps) => {
	const t = useTranslations();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

	const handleDeleteImage = () => {
		if (user?.photo_url) {
			setShowDeleteConfirmation(true);
		}
	};

	const confirmDeleteImage = async () => {
		if (!uuid) return;

		setIsLoading(true);
		try {
			const response = await userService.deleteUserImage(uuid);
			if (response.code === 200) {
				toast.success(response.message);
				const updatedUser = await userService.showUser(uuid);
				setUser(updatedUser.data);
			}
		} catch (error) {
			const apiError = error as ApiError;
			toast.error(apiError.message || "Failed to delete image");
		} finally {
			setIsLoading(false);
			setShowDeleteConfirmation(false);
		}
	};

	useEffect(() => {
		if (isOpen && uuid) {
			setIsLoading(true);
			userService
				.showUser(uuid)
				.then((response) => {
					setUser(response.data);
				})
				.catch((error) => {
					toast.error(
						error instanceof Error
							? error.message
							: "Failed to load village data"
					);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [isOpen, uuid]);

	return (
		<DynamicDialog
			isOpen={isOpen}
			onClose={onClose}
			title={t("navigation.menu.settings.users.show")}
			description={t("navigation.description.show", {
				page: t("navigation.menu.settings.users.label"),
			})}
		>
			{isLoading ? (
				<LoadingSpinner />
			) : user ? (
				<GridContainer className="my-4">
					<GridAvatarItem
						avatar={user.photo_url}
						fullWidth
						showDeleteButton={true}
						onDeleteImage={handleDeleteImage}
					/>
					<GridItem
						label={t("input.common.name.label")}
						value={user.name}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.user.email.label")}
						value={user.email}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.user.phone.label")}
						value={user.phone}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.common.status.label")}
						value={
							<Badge variant={getStatusBadgeVariant(user.status)}>
								{getStatusLabel(user.status, t)}
							</Badge>
						}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.user.roles.label")}
						value={
							user.roles && user.roles.length > 0 ? (
								<>
									{user.roles.map((role, index) => (
										<Badge
											key={index}
											variant={getRoleBadgeVariant(role.name)}
											className="mr-1"
										>
											{getRoleLabel(role.name)}
										</Badge>
									))}
								</>
							) : (
								"-"
							)
						}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.meta.created_at.label")}
						value={user.created_at.formatted}
						className="text-center"
					/>
					<GridItem
						label={t("input.meta.updated_at.label")}
						value={user.updated_at.formatted}
						className="text-center"
					/>
				</GridContainer>
			) : null}

			<ConfirmationDialog
				isOpen={showDeleteConfirmation}
				onClose={() => setShowDeleteConfirmation(false)}
				onConfirm={confirmDeleteImage}
				title={t("dialog.deleteImage.title")}
				description={t("dialog.deleteImage.description")}
				confirmText={t("button.common.delete")}
				cancelText={t("button.common.cancel")}
			/>
		</DynamicDialog>
	);
};

export default UserShowDialog;
