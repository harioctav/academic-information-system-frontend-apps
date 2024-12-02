import { MainLayout } from "@/components/layouts/main-layout";
import RegencyFormInput from "@/components/pages/locations/regencies/form-input";
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
						title={t("navigation.menu.locations.regencies.create")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "back",
							url: "/locations/regencies",
						}}
					/>
					<CardContent>
						<RegencyFormInput />
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default CreateProvincePage;
