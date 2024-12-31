"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { villageService } from "@/lib/services/locations/village.service";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Village } from "@/types/locations/village";
import { toast } from "sonner";
import { ShowDialogProps } from "@/types/common";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Info } from "lucide-react";
import { GridContainer } from "@/components/ui/grid-container";
import { GridItem } from "@/components/ui/grid-item";

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
			description={t("navigation.description.show", {
				page: t("navigation.menu.locations.villages.label"),
			})}
			icon={<Info />}
		>
			{isLoading ? (
				<LoadingSpinner />
			) : village ? (
				<GridContainer className="p-5">
					<GridItem
						label={t("input.common.code.label")}
						value={village.code}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.meta.full_code.label")}
						value={village.full_code}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.location.village.label")}
						value={village.name}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.location.pos_code.label")}
						value={village.pos_code || "-"}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.district_name.label")}
						value={village.district.name}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.regency_name.label")}
						value={`${village.district.regency.type} ${village.district.regency.name}`}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.province_name.label")}
						value={village.district.regency.province.name}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.meta.created_at.label")}
						value={village.created_at.formatted}
						className="text-center"
					/>
					<GridItem
						label={t("input.meta.updated_at.label")}
						value={village.updated_at.formatted}
						className="text-center"
					/>
				</GridContainer>
			) : null}
		</DynamicDialog>
	);
}
