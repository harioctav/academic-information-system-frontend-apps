"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import DistrictFormInput from "@/components/pages/locations/districts/form-input";
import { PageHeader } from "@/components/pages/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { districtService } from "@/lib/services/locations/district.service";
import { useTranslations } from "next-intl";
import React, { use, useEffect, useState } from "react";

const EditDistrictPage = ({
	params,
}: {
	params: Promise<{ uuid: string }>;
}) => {
	const t = useTranslations();

	const resolvedParams = use(params);
	const [districtName, setDistrictName] = useState("");

	useEffect(() => {
		const fetchProvince = async () => {
			const response = await districtService.showDistrict(resolvedParams.uuid);
			setDistrictName(response.data.name);
		};

		fetchProvince();
	}, [resolvedParams.uuid]);

	return (
		<MainLayout>
			<div className="w-full">
				<Card>
					<PageHeader
						title={t("navigation.menu.locations.districts.edit")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "back",
							url: "/locations/districts",
							resourceName: districtName,
						}}
					/>
					<CardContent>
						<DistrictFormInput uuid={resolvedParams.uuid} isEdit />
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default EditDistrictPage;
