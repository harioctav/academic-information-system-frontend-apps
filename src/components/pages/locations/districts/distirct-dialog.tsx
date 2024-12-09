"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { useTranslations } from "next-intl";
import DistrictFormInput from "@/components/pages/locations/districts/form-input";

interface DistrictDialogProps {
	isOpen: boolean;
	onClose: () => void;
	uuid?: string;
	onSuccess?: () => void;
}

export function DistrictDialog({
	isOpen,
	onClose,
	uuid,
	onSuccess,
}: DistrictDialogProps) {
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
			description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, cum?"
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
