"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import ListContainer from "@/components/ui/list-container";
import { ListItem } from "@/components/ui/list-item";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { regencyService } from "@/lib/services/locations/regency.service";
import { ShowDialogProps } from "@/types/common";
import { Regency } from "@/types/locations/regency";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const RegencyShowDialog = ({ isOpen, onClose, uuid }: ShowDialogProps) => {
	const t = useTranslations();
	const [regency, setRegency] = useState<Regency | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen && uuid) {
			setIsLoading(true);
			regencyService
				.showRegency(uuid)
				.then((response) => {
					setRegency(response.data);
				})
				.catch((error) => {
					toast.error(
						error instanceof Error
							? error.message
							: "Failed to load regency data"
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
			title={t("navigation.menu.locations.regencies.show")}
			description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, cum?"
		>
			{isLoading ? (
				<LoadingSpinner />
			) : regency ? (
				<ListContainer>
					<ListItem label={t("input.common.code.label")} value={regency.code} />
					<ListItem
						label={t("input.meta.full_code.label")}
						value={regency.full_code}
					/>
					<ListItem
						label={t("input.location.regency.label")}
						value={`${regency.type} ${regency.name}`}
					/>
					<ListItem
						label={t("input.province_name.label")}
						value={regency.province.name}
					/>
					<ListItem
						label={t("input.meta.created_at.label")}
						value={regency.created_at.formatted}
					/>
					<ListItem
						label={t("input.meta.updated_at.label")}
						value={regency.updated_at.formatted}
					/>
				</ListContainer>
			) : null}
		</DynamicDialog>
	);
};

export default RegencyShowDialog;
