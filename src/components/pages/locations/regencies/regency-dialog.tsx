"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import RegencyFormInput from "@/components/pages/locations/regencies/form-input";
import { useTranslations } from "next-intl";
import { RegionDialogProps } from "@/types/from-prop";

export function RegencyDialog({
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
					? t("navigation.menu.locations.regencies.edit")
					: t("navigation.menu.locations.regencies.create")
			}
			description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, cum?"
		>
			<RegencyFormInput
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
