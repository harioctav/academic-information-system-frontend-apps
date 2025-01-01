"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GridAvatarItem } from "@/components/ui/grid-avatar-item";
import { GridContainer } from "@/components/ui/grid-container";
import { GridItem } from "@/components/ui/grid-item";
import { Separator } from "@/components/ui/separator";
import { getRoleLabel } from "@/config/enums/role.enum";
import {
	getStatusBadgeVariant,
	getStatusLabel,
} from "@/config/enums/status.enum";
import { userService } from "@/lib/services/settings/user.service";
import { Role } from "@/types/settings/role";
import { User } from "@/types/settings/user";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ConfirmationDialog } from "../../shared/confirmation-dialog";
import { ApiError } from "@/types/api";
import { useState } from "react";
import { useAuth } from "@/lib/services/auth/auth-provider";

interface ProfileCardProps {
	user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
	const t = useTranslations();
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const { refreshUser } = useAuth();

	const handleDeleteImage = () => {
		if (user?.photo_url) {
			setShowDeleteConfirmation(true);
		}
	};

	const confirmDeleteImage = async () => {
		if (!user?.uuid) return;

		try {
			const response = await userService.deleteUserImage(user.uuid);
			if (response.code === 200) {
				toast.success(response.message);
				await refreshUser();
			}
		} catch (error) {
			const apiError = error as ApiError;
			toast.error(apiError.message || "Failed to delete image");
		} finally {
			setShowDeleteConfirmation(false);
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardContent className="pt-6">
				<GridContainer>
					<GridAvatarItem
						avatar={user?.photo_url}
						fullWidth
						showDeleteButton={true}
						onDeleteImage={handleDeleteImage}
					/>
					<GridItem
						value={user?.name}
						label={
							user?.roles && user.roles.length > 0 ? (
								<div className="flex items-center justify-center gap-2">
									{user.roles.map((role: Role, index: number) => (
										<span key={index}>{getRoleLabel(role.name)}</span>
									))}
								</div>
							) : (
								"-"
							)
						}
						className="text-center"
						fullWidth
						reversed
					/>
					<div className="md:col-span-2">
						<Separator className="my-2" />
					</div>
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
						label={t("input.user.email.label")}
						value={user?.email || "-"}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.user.phone.label")}
						value={user?.phone || "-"}
						className="text-center"
						fullWidth
					/>
					<div className="md:col-span-2">
						<Separator className="my-2" />
					</div>
					<GridItem
						label={t("input.meta.last_activity.label")}
						value={user?.last_activity.formatted}
						className="text-center"
						fullWidth
					/>
				</GridContainer>
			</CardContent>

			<ConfirmationDialog
				isOpen={showDeleteConfirmation}
				onClose={() => setShowDeleteConfirmation(false)}
				onConfirm={confirmDeleteImage}
				title={t("dialog.deleteImage.title")}
				description={t("dialog.deleteImage.description")}
				confirmText={t("button.common.delete")}
				cancelText={t("button.common.cancel")}
			/>
		</Card>
	);
}
