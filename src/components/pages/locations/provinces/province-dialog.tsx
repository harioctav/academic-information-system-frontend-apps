"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import ProvinceFormInput from "@/components/pages/locations/provinces/form-input";
import { useTranslations } from "next-intl";

interface ProvinceDialogProps {
	isOpen: boolean;
	onClose: () => void;
	uuid?: string;
	onSuccess?: () => void;
}

export function ProvinceDialog({
	isOpen,
	onClose,
	uuid,
	onSuccess,
}: ProvinceDialogProps) {
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
			description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, cum?"
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
