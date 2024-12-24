"use client";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionButton } from "@/components/shared/buttons/action-button";
import { PageHeaderProps } from "@/types/common";

export function PageHeader({ title, description, action }: PageHeaderProps) {
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
				{action && (
					<ActionButton
						type={action.type}
						url={action.url}
						onClick={action.onClick}
						resourceName={action.resourceName}
						permission={action.permission}
						title={title}
					/>
				)}
			</div>
		</CardHeader>
	);
}
