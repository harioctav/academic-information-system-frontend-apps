"use client";

import { navigation } from "@/config/navigations";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavigationUser } from "@/components/layouts/navigations/navigation-user";
import { NavigationSecondary } from "@/components/layouts/navigations/navigation-secondary";
import { NavigationProject } from "@/components/layouts/navigations/navigation-project";
import { NavigationMain } from "@/components/layouts/navigations/navigation-main";
import { Command } from "lucide-react";
import { useTranslations } from "next-intl";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const t = useTranslations();
	const { MainNavigation, SecondaryNavigation, Projects, User } = navigation;

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuButton size="lg" asChild>
						<a href="#">
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground mr-1">
								<Command className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{t("brand.title")}
								</span>
								<span className="truncate text-xs">{t("brand.subtitle")}</span>
							</div>
						</a>
					</SidebarMenuButton>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavigationMain items={MainNavigation} />
				<NavigationProject projects={Projects} />
				<NavigationSecondary items={SecondaryNavigation} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavigationUser user={User} />
			</SidebarFooter>
		</Sidebar>
	);
}
