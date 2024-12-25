import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { RegionDialogProps } from "@/types/common";
import { useTranslations } from "next-intl";
import SubjectFormInput from "@/components/pages/academics/subjects/form-input";

const SubjectFormDialog = ({
	isOpen,
	onClose,
	uuid,
	onSuccess,
}: RegionDialogProps) => {
	const t = useTranslations();

	return (
		<DynamicDialog
			isOpen={isOpen}
			onClose={onClose}
			title={
				uuid
					? t("navigation.menu.academics.subjects.edit")
					: t("navigation.menu.academics.subjects.create")
			}
			description={
				uuid
					? t("navigation.description.edit", {
							page: t("navigation.menu.academics.subjects.label"),
					  })
					: t("navigation.description.create", {
							page: t("navigation.menu.academics.subjects.label"),
					  })
			}
		>
			<SubjectFormInput
				uuid={uuid}
				isEdit={!!uuid}
				onSuccess={() => {
					onClose();
					onSuccess?.();
				}}
			/>
		</DynamicDialog>
	);
};

export default SubjectFormDialog;
