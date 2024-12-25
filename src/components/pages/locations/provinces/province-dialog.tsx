"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import ProvinceFormInput from "@/components/pages/locations/provinces/form-input";
import { useTranslations } from "next-intl";
import { RegionDialogProps } from "@/types/common";

export function ProvinceDialog({
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
					? t("navigation.menu.locations.provinces.edit")
					: t("navigation.menu.locations.provinces.create")
			}
			description={
				uuid
					? t("navigation.description.edit", {
							page: t("navigation.menu.locations.provinces.label"),
					  })
					: t("navigation.description.create", {
							page: t("navigation.menu.locations.provinces.label"),
					  })
			}
		>
			<ProvinceFormInput
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
