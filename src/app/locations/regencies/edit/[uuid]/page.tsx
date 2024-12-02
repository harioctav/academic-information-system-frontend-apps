"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import RegencyFormInput from "@/components/pages/locations/regencies/form-input";
import { PageHeader } from "@/components/pages/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { regencyService } from "@/lib/services/locations/regency.service";
import { useTranslations } from "next-intl";
import React, { use, useEffect, useState } from "react";

const EditRegencyPage = ({ params }: { params: Promise<{ uuid: string }> }) => {
	const t = useTranslations();
	const resolvedParams = use(params);
	const [regencyName, setRegencyName] = useState("");

	useEffect(() => {
		const fetchRegency = async () => {
			const response = await regencyService.showRegency(resolvedParams.uuid);
			setRegencyName(`${response.data.type} ${response.data.name}`);
		};

		fetchRegency();
	}, [resolvedParams.uuid]);

	return (
		<MainLayout>
			<div className="w-full">
				<Card>
					<PageHeader
						title={t("navigation.menu.locations.regencies.edit")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "back",
							url: "/locations/regencies",
							resourceName: regencyName,
						}}
					/>
					<CardContent>
						<RegencyFormInput uuid={resolvedParams.uuid} isEdit />
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default EditRegencyPage;
