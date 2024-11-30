"use client";

import { BadgeCheck, ChevronsUpDown, KeyRound, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth/auth-provider";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { useTranslations } from "next-intl";

export function NavigationUser() {
	const { isMobile } = useSidebar();
	const t = useTranslations();
	const { user, logout } = useAuth();

	const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

	const handleLogoutClick = () => {
		setShowLogoutConfirmation(true);
	};

	const handleLogoutConfirm = async () => {
		await logout();
		setShowLogoutConfirmation(false);
	};

	if (!user) return null;

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={user.photo_profile_path || undefined}
										alt={user.name}
									/>
									<AvatarFallback className="rounded-lg">
										{user.name.substring(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{user.name}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
								<ChevronsUpDown className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
							side={isMobile ? "bottom" : "right"}
							align="end"
							sideOffset={4}
						>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={user.photo_profile_path || undefined}
											alt={user.name}
										/>
										<AvatarFallback className="rounded-lg">
											{user.name.substring(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">{user.name}</span>
										<span className="truncate text-xs">{user.email}</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<BadgeCheck />
									{t("pages.accounts.profile")}
								</DropdownMenuItem>
								<DropdownMenuItem>
									<KeyRound />
									{t("pages.accounts.change-password")}
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleLogoutClick}>
								<LogOut color="#c0392b" />
								<span className="text-red-500">{t("button.logout.label")}</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>

			<ConfirmationDialog
				isOpen={showLogoutConfirmation}
				onClose={() => setShowLogoutConfirmation(false)}
				onConfirm={handleLogoutConfirm}
				title={t("button.logout.title")}
				description={t("button.logout.description")}
				confirmText={t("button.logout.label")}
				cancelText={t("button.cancel")}
			/>
		</>
	);
}
