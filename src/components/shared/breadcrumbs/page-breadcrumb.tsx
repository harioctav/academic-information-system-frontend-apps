import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

interface PageBreadcrumbProps {
	items?: {
		href?: string;
		label: string;
	}[];
	currentPage: string;
}

export function PageBreadcrumb({
	items = [],
	currentPage,
}: PageBreadcrumbProps) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{items.map((item, index) => (
					<React.Fragment key={`breadcrumb-${index}`}>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href={item.href || "#"}>
								{item.label}
							</BreadcrumbLink>
						</BreadcrumbItem>
						{index < items.length && (
							<BreadcrumbSeparator className="hidden md:block" />
						)}
					</React.Fragment>
				))}
				<BreadcrumbItem>
					<BreadcrumbPage>{currentPage}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
