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
			description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, cum?"
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
