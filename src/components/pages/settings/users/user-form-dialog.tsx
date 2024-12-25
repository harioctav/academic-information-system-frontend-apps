import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { RegionDialogProps } from "@/types/common";
import { useTranslations } from "next-intl";
import UserFormInput from "@/components/pages/settings/users/form-input";

const UserFormDialog = ({
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
					? t("navigation.menu.settings.users.edit")
					: t("navigation.menu.settings.users.create")
			}
			description={
				uuid
					? t("navigation.description.edit", {
							page: t("navigation.menu.settings.users.label"),
					  })
					: t("navigation.description.create", {
							page: t("navigation.menu.settings.users.label"),
					  })
			}
		>
			<UserFormInput
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

export default UserFormDialog;
