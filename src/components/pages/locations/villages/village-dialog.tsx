"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { useTranslations } from "next-intl";
import VillageFormInput from "@/components/pages/locations/villages/form-input";
import { RegionDialogProps } from "@/types/from-prop";

export function VillageDialog({
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
					? t("navigation.menu.locations.villages.edit")
					: t("navigation.menu.locations.villages.create")
			}
			description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, cum?"
		>
			<VillageFormInput
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
