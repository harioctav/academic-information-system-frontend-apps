import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { Eye, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface ActionColumnProps {
	showUrl?: string;
	onShow?: () => void;
	showPermission?: string;
	editUrl?: string;
	onEdit?: () => void;
	editPermission?: string;
	deletePermission: string;
	onDelete: () => void;
	conditions?: {
		key: string;
		value: boolean;
		hideShow?: boolean;
		hideEdit?: boolean;
		hideDelete?: boolean;
	}[];
}

export function ActionColumn({
	showUrl,
	onShow,
	showPermission,
	editUrl,
	onEdit,
	editPermission,
	deletePermission,
	onDelete,
	conditions = [],
}: ActionColumnProps) {
	const t = useTranslations();
	const { hasPermission } = usePermissions();

	const shouldHideShow = conditions.some(
		(condition) => condition.value && condition.hideShow
	);
	const shouldHideEdit = conditions.some(
		(condition) => condition.value && condition.hideEdit
	);
	const shouldHideDelete = conditions.some(
		(condition) => condition.value && condition.hideDelete
	);

	const hasShowAccess = showPermission
		? hasPermission(showPermission) && !shouldHideShow
		: false;
	const hasEditAccess = editPermission
		? hasPermission(editPermission) && !shouldHideEdit
		: false;
	const hasDeleteAccess = hasPermission(deletePermission) && !shouldHideDelete;

	if (!hasShowAccess && !hasEditAccess && !hasDeleteAccess) {
		return (
			<div className="flex justify-center">
				<X className="h-4 w-4 text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="flex justify-center">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 p-2 flex items-center">
						<MoreVertical className="h-4 w-4 mr-2" />
						<span>{t("button.common.option")}</span>
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
									<Pencil className="h-4 w-4 mr-4" />
									{t("button.common.edit")}
								</Link>
							) : (
								<button
									onClick={onEdit}
									className="flex items-center text-orange-500 w-full"
								>
									<Pencil className="h-4 w-4 mr-4" />
									{t("button.common.edit")}
								</button>
							)}
						</DropdownMenuItem>
					)}
					{hasShowAccess && (
						<DropdownMenuItem>
							{showUrl ? (
								<Link
									href={showUrl}
									className="flex items-center text-blue-500 w-full"
								>
									<Eye className="h-4 w-4 mr-4" />
									{t("button.common.show")}
								</Link>
							) : (
								<button
									onClick={onShow}
									className="flex items-center text-blue-500 w-full"
								>
									<Eye className="h-4 w-4 mr-4" />
									{t("button.common.show")}
								</button>
							)}
						</DropdownMenuItem>
					)}
					{hasDeleteAccess && (
						<DropdownMenuItem
							onClick={onDelete}
							className="flex items-center text-red-500 w-full"
						>
							<Trash2 className="h-4 w-4 mr-2" />
							{t("button.common.delete")}
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
