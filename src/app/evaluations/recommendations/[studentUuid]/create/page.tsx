"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import { Card } from "@/components/ui/card";
import { Permission } from "@/config/enums/permission.enum";
import { academicOptionService } from "@/lib/services/options/academic.option.service";
import { Student } from "@/types/academics/student";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";

const RecommendationCreatePage = ({
	params,
}: {
	params: Promise<{ studentUuid: string }>;
}) => {
	const t = useTranslations();
	const resolvedParams = use(params);
	const [student, setStudent] = useState<Student | null>(null);

	useEffect(() => {
		const getStudentData = async () => {
			const response = await academicOptionService.showStudent(
				resolvedParams.studentUuid
			);
			setStudent(response.data);
		};

		getStudentData();
	}, [resolvedParams.studentUuid]);

	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.evaluations.recommendations.create")}
						description={t("navigation.description.create", {
							page: t("navigation.menu.evaluations.recommendations.label"),
						})}
						action={{
							type: "back",
							url: `/evaluations/recommendations/${student?.uuid}/detail`,
							permission: Permission.RecommendationShow,
						}}
					/>
				</Card>
			</div>
		</MainLayout>
	);
};

export default RecommendationCreatePage;
