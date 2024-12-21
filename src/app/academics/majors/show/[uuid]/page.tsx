"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import { Card } from "@/components/ui/card";
import { majorService } from "@/lib/services/academics/major.service";
import { useTranslations } from "next-intl";
import React, { use, useEffect, useState } from "react";

const MajorShowPage = ({ params }: { params: Promise<{ uuid: string }> }) => {
	const t = useTranslations();

	const resolvedParams = use(params);
	const [major, setMajor] = useState("");

	useEffect(() => {
		const fetch = async () => {
			const response = await majorService.showMajor(resolvedParams.uuid);
			setMajor(response.data.name);
		};

		fetch();
	}, [resolvedParams.uuid]);

	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.academics.majors.show")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "back",
							url: "/academics/majors",
							resourceName: major,
						}}
					/>
				</Card>
			</div>
		</MainLayout>
	);
};

export default MajorShowPage;
