import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { PageBreadcrumb } from "@/components/shared/breadcrumbs/page-breadcrumb";
import { useTranslations } from "next-intl";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export function MainLayout({ children }: { children: React.ReactNode }) {
	const t = useTranslations();
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<ModeToggle />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<LanguageSwitcher />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<PageBreadcrumb
							items={[{ label: "Building Your Application", href: "#" }]}
							currentPage={t("pages.home")}
						/>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
