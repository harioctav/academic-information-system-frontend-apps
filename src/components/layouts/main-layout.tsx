"use client";

import { AppSidebar } from "@/components/layouts/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { PageBreadcrumb } from "@/components/shared/breadcrumbs/page-breadcrumb";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useAuth } from "@/lib/services/auth/auth-provider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { routes, validModulePaths } from "@/config/routes/index";
import { checkPermission } from "@/config/permissions";
import { LoadingPage } from "@/components/ui/loading-page";
import NotFoundPage from "@/app/not-found";
import { ForbiddenPage } from "@/app/errors/forbidden";

export function MainLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const { user, isLoading } = useAuth();
	const [hasForbidden, setHasForbidden] = useState(false);
	const [isValidRoute, setIsValidRoute] = useState(true);

	useEffect(() => {
		const allValidRoutes = [...routes.public, ...validModulePaths, "/"];
		const routeExists = allValidRoutes.some(
			(route) => pathname === route || pathname.startsWith(route + "/")
		);
		setIsValidRoute(routeExists);

		if (!isLoading && !user) {
			router.replace("/auth/login");
			return;
		}

		const isValidModulePath = validModulePaths.some((path) =>
			pathname.startsWith(path)
		);

		if (user && isValidModulePath) {
			const userPermissions = user.roles.flatMap((role) => role.permissions);
			setHasForbidden(!checkPermission(pathname, userPermissions));
		} else {
			setHasForbidden(false);
		}
	}, [isLoading, user, pathname, router]);

	if (!isValidRoute) {
		return <NotFoundPage />;
	}

	if (isLoading || !user) {
		return <LoadingPage />;
	}

	if (hasForbidden) {
		return <ForbiddenPage />;
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="h-4" />
						<ModeToggle />
						<Separator orientation="vertical" className="h-4" />
						<LanguageSwitcher />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<PageBreadcrumb />
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-[100vw]">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
