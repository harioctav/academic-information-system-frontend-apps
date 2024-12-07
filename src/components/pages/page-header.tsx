import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface PageHeaderProps {
	title: string;
	description: string;
	action?: {
		type: "create" | "back";
		url?: string; // Optional URL for navigation
		onClick?: () => void; // Optional click handler for dialog
		resourceName?: string;
	};
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
	const t = useTranslations();

	const renderActionButton = () => {
		if (!action) return null;

		if (action.type === "create") {
			return (
				<Button size="sm" asChild={!!action.url}>
					{action.url ? (
						<Link href={action.url} className="flex items-center">
							<Plus className="mr-1 h-4 w-4" />
							{t("button.create")}{" "}
							{action.resourceName || title.split(" ").pop()}
						</Link>
					) : (
						<div onClick={action.onClick} className="flex items-center">
							<Plus className="mr-1 h-4 w-4" />
							{t("button.create")}{" "}
							{action.resourceName || title.split(" ").pop()}
						</div>
					)}
				</Button>
			);
		}

		return (
			<Button size="sm" variant="destructive" asChild>
				<Link href={action.url!} className="flex items-center">
					<ChevronLeft className="mr-1 h-4 w-4" />
					{t("button.back-to-list")}
				</Link>
			</Button>
		);
	};

	return (
		<CardHeader>
			<div className="flex justify-between">
				<div>
					<CardTitle>
						{title}
						{action?.type === "back" &&
							action.resourceName &&
							` - ${action.resourceName}`}
					</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
				{renderActionButton()}
			</div>
		</CardHeader>
	);
}
