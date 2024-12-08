import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface ActionColumnProps {
	editUrl?: string;
	onEdit?: () => void;
	editPermission: string;
	deletePermission: string;
	onDelete: () => void;
	conditions?: {
		key: string;
		value: boolean;
		hideEdit?: boolean;
		hideDelete?: boolean;
	}[];
}

export function ActionColumn({
	editUrl,
	onEdit,
	editPermission,
	deletePermission,
	onDelete,
	conditions = [],
}: ActionColumnProps) {
	const t = useTranslations();
	const { hasPermission } = usePermissions();

	const shouldHideEdit = conditions.some(
		(condition) => condition.value && condition.hideEdit
	);
	const shouldHideDelete = conditions.some(
		(condition) => condition.value && condition.hideDelete
	);

	const hasEditAccess = hasPermission(editPermission) && !shouldHideEdit;
	const hasDeleteAccess = hasPermission(deletePermission) && !shouldHideDelete;

	if (!hasEditAccess && !hasDeleteAccess) return null;

	return (
		<div className="flex justify-center">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 p-2 flex items-center">
						<MoreVertical className="h-4 w-4 mr-2" />
						<span>{t("button.option")}</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{hasEditAccess && (
						<DropdownMenuItem>
							{editUrl ? (
								<Link
									href={editUrl}
									className="flex items-center text-orange-500 w-full"
								>
									<Pencil className="h-4 w-4 mr-2" />
									{t("button.edit")}
								</Link>
							) : (
								<button
									onClick={onEdit}
									className="flex items-center text-orange-500 w-full"
								>
									<Pencil className="h-4 w-4 mr-2" />
									{t("button.edit")}
								</button>
							)}
						</DropdownMenuItem>
					)}

					{hasDeleteAccess && (
						<DropdownMenuItem
							onClick={onDelete}
							className="flex items-center text-red-600"
						>
							<Trash2 className="h-4 w-4 mr-2" />
							{t("button.delete")}
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
