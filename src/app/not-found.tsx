"use client";

import { GuestLayout } from "@/components/layouts/guest-layout";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
	const router = useRouter();
	const t = useTranslations();

	return (
		<GuestLayout>
			<div className="flex flex-col items-center justify-center gap-4">
				<FileQuestion className="h-32 w-32 text-primary animate-pulse" />
				<h1 className="text-4xl font-bold">
					{t("pages.error.not-found.title")}
				</h1>
				<p className="text-muted-foreground">
					{t("pages.error.not-found.subtitle")}
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
