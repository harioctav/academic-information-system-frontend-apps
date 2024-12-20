"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { RegionDialogProps } from "@/types/common";
import { useTranslations } from "next-intl";
import MajorFormInput from "./form-input";

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
			description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, cum?"
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
