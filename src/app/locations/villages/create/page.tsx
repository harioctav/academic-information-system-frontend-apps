import { MainLayout } from "@/components/layouts/main-layout";
import VillageFormInput from "@/components/pages/locations/villages/form-input";
import { PageHeader } from "@/components/pages/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import React from "react";

const CreateVillagePage = () => {
	const t = useTranslations();
	return (
		<MainLayout>
			<div className="w-full">
				<Card>
					<PageHeader
						title={t("navigation.menu.locations.villages.create")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "back",
							url: "/locations/villages",
						}}
					/>
					<CardContent>
						<VillageFormInput />
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default CreateVillagePage;
