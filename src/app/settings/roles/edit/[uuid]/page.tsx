"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import RoleFormInput from "@/components/pages/settings/roles/form-input";
import { Card, CardContent } from "@/components/ui/card";
import { getRoleLabel } from "@/config/enums/role.enum";
import { roleService } from "@/lib/services/settings/role.service";
import { useTranslations } from "next-intl";
import React, { use, useEffect, useState } from "react";

const EditRolePage = ({ params }: { params: Promise<{ uuid: string }> }) => {
	const t = useTranslations();

	const resolvedParams = use(params);
	const [roleName, setRoleName] = useState("");

	useEffect(() => {
		const fetchRole = async () => {
			const response = await roleService.showRole(resolvedParams.uuid);
			setRoleName(getRoleLabel(response.data.name));
		};

		fetchRole();
	}, [resolvedParams.uuid]);

	return (
		<MainLayout>
			<div className="w-full">
				<Card>
					<PageHeader
						title={t("navigation.menu.settings.roles.edit")}
						description={t("navigation.description.edit", {
							page: t("navigation.menu.settings.roles.label"),
						})}
						action={{
							type: "back",
							url: "/settings/roles",
							resourceName: roleName,
						}}
					/>
					<CardContent>
						<RoleFormInput uuid={resolvedParams.uuid} isEdit />
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default EditRolePage;
