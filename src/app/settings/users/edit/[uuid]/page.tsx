"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import UserFormInput from "@/components/pages/settings/users/form-input";
import { Card, CardContent } from "@/components/ui/card";
import { userService } from "@/lib/services/settings/user.service";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";

const EditUserPage = ({ params }: { params: Promise<{ uuid: string }> }) => {
	const t = useTranslations();

	const resolvedParams = React.use(params);
	const [name, setName] = React.useState("");

	useEffect(() => {
		const fetchRole = async () => {
			const response = await userService.showUser(resolvedParams.uuid);
			setName(response.data.name);
		};

		fetchRole();
	}, [resolvedParams.uuid]);

	return (
		<MainLayout>
			<div className="w-full">
				<Card>
					<PageHeader
						title={t("navigation.menu.settings.users.edit")}
						description={t("navigation.description.edit", {
							page: t("navigation.menu.settings.users.label"),
						})}
						action={{
							type: "back",
							url: "/settings/users",
							resourceName: name,
						}}
					/>
					<CardContent>
						<UserFormInput uuid={resolvedParams.uuid} isEdit />
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default EditUserPage;
