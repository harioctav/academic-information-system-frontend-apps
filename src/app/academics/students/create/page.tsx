"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import React from "react";

const StudentCreatePage = () => {
	const t = useTranslations();
	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.academics.students.label")}
						description={t("navigation.description.create", {
							page: t("navigation.menu.academics.students.label"),
						})}
						action={{
							type: "back",
							url: "/academics/students",
						}}
					/>
					<CardContent>
						<div className="flex flex-1 flex-col gap-4">
							<div className="grid auto-rows-min gap-4 md:grid-cols-3">
								<div className="aspect-video rounded-xl bg-muted/50" />
								<div className="aspect-video rounded-xl bg-muted/50" />
								<div className="aspect-video rounded-xl bg-muted/50" />
							</div>
							<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default StudentCreatePage;
