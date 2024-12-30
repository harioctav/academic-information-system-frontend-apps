"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import StudentWizardForm from "@/components/pages/academics/students/student-wizard-form";
import { PageHeader } from "@/components/pages/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

const StudentCreatePage = () => {
	const t = useTranslations();

	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.academics.students.create")}
						description={t("navigation.description.create", {
							page: t("navigation.menu.academics.students.label"),
						})}
						action={{
							type: "back",
							url: "/academics/students",
						}}
					/>
					<CardContent>
						<StudentWizardForm />
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default StudentCreatePage;
