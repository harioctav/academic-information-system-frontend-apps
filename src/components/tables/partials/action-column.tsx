import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface ActionColumnProps {
	editUrl: string;
	editPermission: boolean;
	deletePermission: boolean;
	onDelete: () => void;
	isSpecialRow?: boolean;
	specialMessage?: string;
}

export function ActionColumn({
	editUrl,
	editPermission,
	deletePermission,
	onDelete,
	isSpecialRow,
	specialMessage = "Cannot modify this record.",
}: ActionColumnProps) {
	const t = useTranslations();

	if (isSpecialRow) {
		return (
			<div className="flex justify-center">
				<Badge variant="red" className="text-[12px]">
					{specialMessage}
				</Badge>
			</div>
		);
	}

	const hasActions = !isSpecialRow && (editPermission || deletePermission);

	if (!hasActions) {
		return null;
	}

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
					{!isSpecialRow && editPermission && (
						<DropdownMenuItem asChild>
							<Link
								href={editUrl}
								className="flex items-center text-orange-500"
							>
								<Pencil className="h-4 w-4 mr-2" />
								{t("button.edit")}
							</Link>
						</DropdownMenuItem>
					)}
					{!isSpecialRow && deletePermission && (
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
