"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import ListContainer from "@/components/ui/list-container";
import { ListItem } from "@/components/ui/list-item";
import { provinceService } from "@/lib/services/locations/province.service";
import { ShowDialogProps } from "@/types/common";
import { Province } from "@/types/locations/province";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ProvinceShowDialog = ({ isOpen, onClose, uuid }: ShowDialogProps) => {
	const t = useTranslations();
	const [province, setProvince] = useState<Province | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen && uuid) {
			setIsLoading(true);
			provinceService
				.showProvince(uuid)
				.then((response) => {
					setProvince(response.data);
				})
				.catch((error) => {
					toast.error(
						error instanceof Error
							? error.message
							: "Failed to load province data"
					);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [isOpen, uuid]);

	return (
		<DynamicDialog
			isOpen={isOpen}
			onClose={onClose}
			title={t("navigation.menu.locations.provinces.show")}
			description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, cum?"
		>
			{isLoading ? (
				<div>Loading...</div>
			) : province ? (
				<ListContainer>
					<ListItem
						label={t("input.common.code.label")}
						value={province.code}
					/>
					<ListItem
						label={t("input.location.province.label")}
						value={province.name}
					/>
					<ListItem
						label={t("input.meta.created_at.label")}
						value={province.created_at.formatted}
					/>
					<ListItem
						label={t("input.meta.updated_at.label")}
						value={province.updated_at.formatted}
					/>
				</ListContainer>
			) : null}
		</DynamicDialog>
	);
};

export default ProvinceShowDialog;
