"use client";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionButton } from "@/components/shared/buttons/action-button";
import { PageHeaderProps } from "@/types/common";

export function PageHeader({
	title,
	description,
	action,
	icon,
}: PageHeaderProps & { icon?: React.ReactNode }) {
	return (
		<CardHeader>
			<div className="flex justify-between">
				<div className="flex items-center gap-3">
					{icon && <div className="text-2xl mr-2">{icon}</div>}
					<div>
						<CardTitle>
							{title}
							{action?.type === "back" &&
								action.resourceName &&
								` - ${action.resourceName}`}
						</CardTitle>
						<CardDescription>{description}</CardDescription>
					</div>
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
