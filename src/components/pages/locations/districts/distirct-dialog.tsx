"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { useTranslations } from "next-intl";
import DistrictFormInput from "@/components/pages/locations/districts/form-input";
import { RegionDialogProps } from "@/types/common";

export function DistrictDialog({
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
					? t("navigation.menu.locations.districts.edit")
					: t("navigation.menu.locations.districts.create")
			}
			description={
				uuid
					? t("navigation.description.edit", {
							page: t("navigation.menu.locations.districts.label"),
					  })
					: t("navigation.description.create", {
							page: t("navigation.menu.locations.districts.label"),
					  })
			}
		>
			<DistrictFormInput
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
