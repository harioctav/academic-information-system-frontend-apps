"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import ProvinceFormInput from "./form-input";
import { useTranslations } from "next-intl";

interface ProvinceDialogProps {
	isOpen: boolean;
	onClose: () => void;
	uuid?: string;
	onSuccess?: () => void; // Add this
}

export function ProvinceDialog({
	isOpen,
	onClose,
	uuid,
	onSuccess,
}: ProvinceDialogProps) {
	const t = useTranslations();

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{uuid
							? t("navigation.menu.locations.provinces.edit")
							: t("navigation.menu.locations.provinces.create")}
					</DialogTitle>
					<DialogDescription>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
						cum?
					</DialogDescription>
				</DialogHeader>
				<ProvinceFormInput
					uuid={uuid}
					isEdit={!!uuid}
					onSuccess={() => {
						onClose();
						onSuccess?.(); // Call onSuccess after successful submission
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}
