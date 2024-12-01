"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

const getSingularForm = (plural: string): string => {
	const specialCases: { [key: string]: string } = {
		categories: "category",
		regencies: "regency",
		cities: "city",
		properties: "property",
		provinces: "province",
		districts: "district",
		villages: "village",
		students: "student",
		majors: "major",
		subjects: "subject",
		users: "user",
		roles: "role",
	};

	return specialCases[plural.toLowerCase()] || plural.slice(0, -1);
};

export function PageBreadcrumb() {
	const pathname = usePathname();
	const t = useTranslations();

	const generateBreadcrumbs = () => {
		const breadcrumbs = [{ href: "/", label: t("pages.home") }];
		const paths = pathname.split("/").filter((path) => path);

		if (paths.length === 0) return breadcrumbs;

		const isEditPage = paths.length > 2 && paths[2].length === 36;
		const mainSection = paths[1];
		const parentSection = paths[0];

		// Add only the main section (e.g., "provinces", "students")
		if (mainSection) {
			const mainLabel = t(
				`navigation.menu.${parentSection}.${mainSection}.label`
			);
			breadcrumbs.push({
				href: `/${parentSection}/${mainSection}`,
				label: mainLabel,
			});

			// Add action pages (create/edit)
			if (isEditPage) {
				breadcrumbs.push({
					href: pathname,
					label: t(`navigation.menu.${parentSection}.${mainSection}.edit`),
				});
			} else if (paths.includes("create")) {
				breadcrumbs.push({
					href: pathname,
					label: t(`navigation.menu.${parentSection}.${mainSection}.create`),
				});
			}
		}

		return breadcrumbs;
	};

	const breadcrumbs = generateBreadcrumbs();

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((crumb, index) => (
					<React.Fragment key={crumb.href}>
						<BreadcrumbItem className="hidden md:block">
							{index === breadcrumbs.length - 1 ? (
								<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
							) : (
								<BreadcrumbLink asChild>
									<Link href={crumb.href}>{crumb.label}</Link>
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>
						{index < breadcrumbs.length - 1 && (
							<BreadcrumbSeparator className="hidden md:block" />
						)}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
