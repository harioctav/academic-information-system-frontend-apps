import { MainLayout } from "@/components/layouts/main-layout";
import DistrictFormInput from "@/components/pages/locations/districts/form-input";
import { PageHeader } from "@/components/pages/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import React from "react";

const CreateDistrictPage = () => {
	const t = useTranslations();
	return (
		<MainLayout>
			<div className="w-full">
				<Card>
					<PageHeader
						title={t("navigation.menu.locations.districts.create")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "back",
							url: "/locations/districts",
						}}
					/>
					<CardContent>
						<DistrictFormInput />
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default CreateDistrictPage;
