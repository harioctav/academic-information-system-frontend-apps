"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import VillageFormInput from "@/components/pages/locations/villages/form-input";
import { PageHeader } from "@/components/pages/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { villageService } from "@/lib/services/locations/village.service";
import { useTranslations } from "next-intl";
import React, { use, useEffect, useState } from "react";

const EditVillagePage = ({ params }: { params: Promise<{ uuid: string }> }) => {
	const t = useTranslations();

	const resolvedParams = use(params);
	const [villageName, setVillageName] = useState("");

	useEffect(() => {
		const fetchVillage = async () => {
			const response = await villageService.showVillage(resolvedParams.uuid);
			setVillageName(response.data.name);
		};

		fetchVillage();
	}, [resolvedParams.uuid]);

	return (
		<MainLayout>
			<div className="w-full">
				<Card>
					<PageHeader
						title={t("navigation.menu.locations.villages.edit")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "back",
							url: "/locations/villages",
							resourceName: villageName,
						}}
					/>
					<CardContent>
						<VillageFormInput uuid={resolvedParams.uuid} isEdit />
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default EditVillagePage;
