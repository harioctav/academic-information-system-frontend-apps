import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { ActionButtonProps } from "@/types/common";

export function ActionButton({
	type,
	url,
	onClick,
	resourceName,
	permission,
	title,
}: ActionButtonProps) {
	const t = useTranslations();
	const { hasPermission } = usePermissions();

	if (type === "create" && permission) {
		if (!hasPermission(permission)) return null;
	}

	if (type === "create") {
		return (
			<Button size="sm" asChild={!!url}>
				{url ? (
					<Link href={url} className="flex items-center">
						<Plus className="mr-1 h-4 w-4" />
						{t("button.common.create")}{" "}
						{resourceName || title?.split(" ").pop()}
					</Link>
				) : (
					<div onClick={onClick} className="flex items-center">
						<Plus className="mr-1 h-4 w-4" />
						{t("button.common.create")}{" "}
						{resourceName || title?.split(" ").pop()}
					</div>
				)}
			</Button>
		);
	}

	return (
		<Button size="sm" variant="destructive" asChild>
			<Link href={url!} className="flex items-center">
				<ChevronLeft className="mr-1 h-4 w-4" />
				{t("button.common.back")}
			</Link>
		</Button>
	);
}
