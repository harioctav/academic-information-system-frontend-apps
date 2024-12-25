"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { RegionDialogProps } from "@/types/common";
import { useTranslations } from "next-intl";
import MajorSubjectFormInput from "@/components/pages/academics/majors/subjects/form-input";

interface MajorSubjectDialogProps extends RegionDialogProps {
	majorUuid: string;
}

const MajorSubjectDialog = ({
	isOpen,
	onClose,
	uuid,
	onSuccess,
	majorUuid,
}: MajorSubjectDialogProps) => {
	const t = useTranslations();

	return (
		<DynamicDialog
			isOpen={isOpen}
			onClose={onClose}
			title={
				uuid
					? t("navigation.menu.academics.majors.subjects.edit")
					: t("navigation.menu.academics.majors.subjects.create")
			}
			description={
				uuid
					? t("navigation.description.edit", {
							page: t("navigation.menu.academics.majors.subjects.label"),
					  })
					: t("navigation.description.create", {
							page: t("navigation.menu.academics.majors.subjects.label"),
					  })
			}
		>
			<MajorSubjectFormInput
				uuid={uuid}
				isEdit={!!uuid}
				majorUuid={majorUuid}
				onSuccess={() => {
					onClose();
					onSuccess?.();
				}}
			/>
		</DynamicDialog>
	);
};

export default MajorSubjectDialog;
