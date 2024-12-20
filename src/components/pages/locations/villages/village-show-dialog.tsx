"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { villageService } from "@/lib/services/locations/village.service";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Village } from "@/types/locations/village";
import { toast } from "sonner";
import { ShowDialogProps } from "@/types/common";
import { ListItem } from "@/components/ui/list-item";
import ListContainer from "@/components/ui/list-container";

export function VillageShowDialog({ isOpen, onClose, uuid }: ShowDialogProps) {
	const t = useTranslations();
	const [village, setVillage] = useState<Village | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen && uuid) {
			setIsLoading(true);
			villageService
				.showVillage(uuid)
				.then((response) => {
					setVillage(response.data);
				})
				.catch((error) => {
					toast.error(
						error instanceof Error
							? error.message
							: "Failed to load village data"
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
			title={t("navigation.menu.locations.villages.show")}
			description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, cum?"
		>
			{isLoading ? (
				<div>Loading...</div>
			) : village ? (
				<ListContainer>
					<ListItem label={t("input.common.code.label")} value={village.code} />
					<ListItem
						label={t("input.meta.full_code.label")}
						value={village.full_code}
					/>
					<ListItem
						label={t("input.location.village.label")}
						value={village.name}
					/>
					<ListItem
						label={t("input.location.pos_code.label")}
						value={village.pos_code || "-"}
					/>
					<ListItem
						label={t("input.district_name.label")}
						value={village.district.name}
					/>
					<ListItem
						label={t("input.regency_name.label")}
						value={`${village.district.regency.type} ${village.district.regency.name}`}
					/>
					<ListItem
						label={t("input.province_name.label")}
						value={village.district.regency.province.name}
					/>
					<ListItem
						label={t("input.meta.created_at.label")}
						value={village.created_at.formatted}
					/>
					<ListItem
						label={t("input.meta.updated_at.label")}
						value={village.updated_at.formatted}
					/>
				</ListContainer>
			) : null}
		</DynamicDialog>
	);
}
