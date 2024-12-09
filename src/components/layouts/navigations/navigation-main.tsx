"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
import { usePermissions } from "@/hooks/permissions/use-permission";

interface NavigationItem {
	title: string;
	url: string;
	icon?: LucideIcon;
	permission?: string;
	items?: Omit<NavigationItem, "icon">[];
}

interface NavigationProps {
	items: Record<string, NavigationItem[]>;
}

export function NavigationMain({ items }: NavigationProps) {
	const t = useTranslations();
	const pathname = usePathname();
	const [openSections, setOpenSections] = useState<string[]>([]);
	const { hasPermission } = usePermissions();

	useEffect(() => {
		if (pathname === "/" || !pathname.split("/")[1]) {
			setOpenSections([]);
			return;
		}

		const currentGroup = Object.entries(items).find(([, groupItems]) =>
			groupItems.some((item) =>
				item.items?.some((subItem) => pathname.startsWith(subItem.url))
			)
		);

		if (currentGroup) {
			const activeItem = currentGroup[1].find((item) =>
				item.items?.some((subItem) => pathname.startsWith(subItem.url))
			);
			if (activeItem) {
				const sectionKey = `${currentGroup[0]}-${activeItem.title}`;
				setOpenSections([sectionKey]);
			}
		} else {
			setOpenSections([]);
		}
	}, [pathname, items]);

	const toggleSection = (groupLabel: string, itemTitle: string) => {
		const sectionKey = `${groupLabel}-${itemTitle}`;
		setOpenSections((prev) =>
			prev.includes(sectionKey)
				? prev.filter((key) => key !== sectionKey)
				: [sectionKey]
		);
	};

	// Filter items based on permissions
	const filterNavigationItems = (items: NavigationItem[]) => {
		return items.filter((item) => {
			if (item.items) {
				const filteredSubItems = item.items.filter(
					(subItem) => !subItem.permission || hasPermission(subItem.permission)
				);
				item.items = filteredSubItems;
				return filteredSubItems.length > 0;
			}
			return !item.permission || hasPermission(item.permission);
		});
	};

	return (
		<>
			{Object.entries(items).map(([groupLabel, groupItems]) => {
				const filteredItems = filterNavigationItems(groupItems);

				// Only render group if it has visible items
				return filteredItems.length > 0 ? (
					<SidebarGroup key={groupLabel}>
						<SidebarGroupLabel>{t(groupLabel)}</SidebarGroupLabel>
						<SidebarMenu>
							{filteredItems.map((item) => {
								const sectionKey = `${groupLabel}-${item.title}`;
								const isBaseActive =
									item.url === "/"
										? pathname === "/"
										: pathname.startsWith(item.url.split("/")[1]);

								return (
									<Collapsible
										key={item.title}
										asChild
										open={openSections.includes(sectionKey)}
									>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												tooltip={t(item.title)}
												className={isBaseActive ? "bg-muted" : ""}
											>
												{item.items ? (
													<div
														onClick={() =>
															toggleSection(groupLabel, item.title)
														}
													>
														{item.icon && (
															<item.icon
																className={isBaseActive ? "text-primary" : ""}
															/>
														)}
														<span className={isBaseActive ? "font-medium" : ""}>
															{t(item.title)}
														</span>
													</div>
												) : (
													<Link href={item.url}>
														{item.icon && (
															<item.icon
																className={isBaseActive ? "text-primary" : ""}
															/>
														)}
														<span className={isBaseActive ? "font-medium" : ""}>
															{t(item.title)}
														</span>
													</Link>
												)}
											</SidebarMenuButton>
											{item.items?.length ? (
												<>
													<CollapsibleTrigger asChild>
														<SidebarMenuAction
															className="data-[state=open]:rotate-90"
															onClick={() =>
																toggleSection(groupLabel, item.title)
															}
														>
															<ChevronRight />
															<span className="sr-only">Toggle</span>
														</SidebarMenuAction>
													</CollapsibleTrigger>
													<CollapsibleContent>
														<SidebarMenuSub>
															{item.items.map((subItem) => (
																<SidebarMenuSubItem key={subItem.title}>
																	<SidebarMenuSubButton
																		asChild
																		className={
																			pathname.startsWith(subItem.url)
																				? "bg-muted"
																				: ""
																		}
																	>
																		<Link href={subItem.url}>
																			<span
																				className={
																					pathname.startsWith(subItem.url)
																						? "font-medium text-primary"
																						: ""
																				}
																			>
																				{t(subItem.title)}
																			</span>
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
								);
							})}
						</SidebarMenu>
					</SidebarGroup>
				) : null;
			})}
		</>
	);
}
