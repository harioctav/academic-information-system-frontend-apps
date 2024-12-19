import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import UserFormInput from "@/components/pages/settings/users/form-input";
import { Card, CardContent } from "@/components/ui/card";
import { Permission } from "@/config/enums/permission.enum";
import { useTranslations } from "next-intl";
import React from "react";

const CreateUserPage = () => {
	const t = useTranslations();
	return (
		<MainLayout>
			<div className="w-full container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.settings.users.create")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "back",
							url: "/settings/users",
							permission: Permission.UserIndex,
						}}
					/>
					<CardContent>
						<UserFormInput />
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default CreateUserPage;
