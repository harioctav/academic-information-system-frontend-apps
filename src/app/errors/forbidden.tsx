"use client";

import { GuestLayout } from "@/components/layouts/guest-layout";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function ForbiddenPage() {
	const router = useRouter();
	const t = useTranslations();

	return (
		<GuestLayout>
			<div className="flex flex-col items-center justify-center gap-4">
				<ShieldX className="h-32 w-32 text-destructive animate-pulse" />
				<h1 className="text-4xl font-bold">
					{t("pages.error.forbidden.title")}
				</h1>
				<p className="text-muted-foreground">
					{t("pages.error.forbidden.subtitle")}
				</p>
				<Button onClick={() => router.push("/")}>
					{t("button.common.back", {
						page: t("pages.home"),
					})}
				</Button>
			</div>
		</GuestLayout>
	);
}
