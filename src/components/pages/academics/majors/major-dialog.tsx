"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { RegionDialogProps } from "@/types/common";
import { useTranslations } from "next-intl";
import MajorFormInput from "@/components/pages/academics/majors/form-input";

export function MajorDialog({
	isOpen,
	onClose,
	uuid,
	onSuccess,
}: RegionDialogProps) {
	const t = useTranslations();

	return (
		<DynamicDialog
			isOpen={isOpen}
			onClose={onClose}
			title={
				uuid
					? t("navigation.menu.academics.majors.edit")
					: t("navigation.menu.academics.majors.create")
			}
			description={
				uuid
					? t("navigation.description.edit", {
							page: t("navigation.menu.academics.majors.label"),
					  })
					: t("navigation.description.create", {
							page: t("navigation.menu.academics.majors.label"),
					  })
			}
		>
			<MajorFormInput
				uuid={uuid}
				isEdit={!!uuid}
				onSuccess={() => {
					onClose();
					onSuccess?.();
				}}
			/>
		</DynamicDialog>
	);
}
