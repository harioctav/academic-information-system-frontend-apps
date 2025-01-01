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
import { Role } from "@/types/settings/role";
import { User } from "@/types/settings/user";
import { useTranslations } from "next-intl";

interface ProfileCardProps {
	user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
	const t = useTranslations();

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardContent className="pt-6">
				<GridContainer>
					<GridAvatarItem avatar={user?.photo_url} fullWidth />
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
		</Card>
	);
}
