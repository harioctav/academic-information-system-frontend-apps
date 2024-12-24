"use client";

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
import { ShowDialogProps } from "@/types/common";
import { User } from "@/types/settings/user";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const UserShowDialog = ({ isOpen, onClose, uuid }: ShowDialogProps) => {
	const t = useTranslations();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(false);

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
			description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, cum?"
		>
			{isLoading ? (
				<LoadingSpinner />
			) : user ? (
				<GridContainer>
					<GridAvatarItem avatar={user.photo_url} fullWidth />
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
		</DynamicDialog>
	);
};

export default UserShowDialog;
