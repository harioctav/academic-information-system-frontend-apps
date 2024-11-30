"use client";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface PageHeaderProps {
	title: string;
	description: string;
	showBackButton?: boolean;
	backRoute?: string;
	actions?: React.ReactNode;
}

export function PageHeader({
	title,
	description,
	showBackButton,
	backRoute,
	actions,
}: PageHeaderProps) {
	const t = useTranslations();

	return (
		<CardHeader>
			<div className="flex justify-between">
				<div>
					<CardTitle>
						<div className="text-2xl font-semibold">{title}</div>
					</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
				<div className="flex items-center gap-2">
					{showBackButton && (
						<Button size="sm" variant="destructive" asChild>
							<Link href={backRoute || "#"} className="flex items-center">
								<ChevronLeft className="h-4 w-4 mr-2" />
								{t("button.back")}
							</Link>
						</Button>
					)}
					{actions}
				</div>
			</div>
		</CardHeader>
	);
}
