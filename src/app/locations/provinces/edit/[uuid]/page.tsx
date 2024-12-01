"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import ProvinceFormInput from "@/components/pages/locations/provinces/form-input";
import { PageHeader } from "@/components/pages/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { provinceService } from "@/lib/services/locations/province.service";
import { useTranslations } from "next-intl";
import React, { use, useEffect, useState } from "react";

const EditProvincePage = ({
	params,
}: {
	params: Promise<{ uuid: string }>;
}) => {
	const t = useTranslations();

	const resolvedParams = use(params);
	const [provinceName, setProvinceName] = useState("");

	useEffect(() => {
		const fetchProvince = async () => {
			const response = await provinceService.showProvince(resolvedParams.uuid);
			setProvinceName(response.data.name);
		};

		fetchProvince();
	}, [resolvedParams.uuid]);

	return (
		<MainLayout>
			<div className="w-full">
				<Card>
					<PageHeader
						title={t("navigation.menu.locations.provinces.edit")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "back",
							url: "/locations/provinces",
							resourceName: provinceName,
						}}
					/>
					<CardContent>
						<ProvinceFormInput uuid={resolvedParams.uuid} isEdit />
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default EditProvincePage;
