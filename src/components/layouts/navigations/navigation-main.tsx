"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavigationMain({
	items,
}: {
	items: Record<
		string,
		Array<{
			title: string;
			url: string;
			icon: LucideIcon;
			isActive?: boolean;
			items?: { title: string; url: string }[];
		}>
	>;
}) {
	const t = useTranslations();

	return (
		<>
			{Object.entries(items).map(([groupLabel, groupItems]) => (
				<SidebarGroup key={groupLabel}>
					<SidebarGroupLabel>{t(groupLabel)}</SidebarGroupLabel>
					<SidebarMenu>
						{groupItems.map((item) => (
							<Collapsible key={item.title} asChild defaultOpen={item.isActive}>
								<SidebarMenuItem>
									<SidebarMenuButton asChild tooltip={t(item.title)}>
										<Link href={item.url}>
											<item.icon />
											<span>{t(item.title)}</span>
										</Link>
									</SidebarMenuButton>
									{item.items?.length ? (
										<>
											<CollapsibleTrigger asChild>
												<SidebarMenuAction className="data-[state=open]:rotate-90">
													<ChevronRight />
													<span className="sr-only">Toggle</span>
												</SidebarMenuAction>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub>
													{item.items?.map((subItem) => (
														<SidebarMenuSubItem key={subItem.title}>
															<SidebarMenuSubButton asChild>
																<Link href={subItem.url}>
																	<span>{t(subItem.title)}</span>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													))}
												</SidebarMenuSub>
											</CollapsibleContent>
										</>
									) : null}
								</SidebarMenuItem>
							</Collapsible>
						))}
					</SidebarMenu>
				</SidebarGroup>
			))}
		</>
	);
}
