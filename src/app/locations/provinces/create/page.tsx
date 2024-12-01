import { MainLayout } from "@/components/layouts/main-layout";
import ProvinceFormInput from "@/components/pages/locations/provinces/form-input";
import { PageHeader } from "@/components/pages/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import React from "react";

const CreateProvincePage = () => {
	const t = useTranslations();
	return (
		<MainLayout>
			<div className="w-full">
				<Card>
					<PageHeader
						title={t("navigation.menu.locations.provinces.create")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "back",
							url: "/locations/provinces",
						}}
					/>
					<CardContent>
						<ProvinceFormInput />
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default CreateProvincePage;
