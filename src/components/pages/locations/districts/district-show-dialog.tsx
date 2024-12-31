"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { GridContainer } from "@/components/ui/grid-container";
import { GridItem } from "@/components/ui/grid-item";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { districtService } from "@/lib/services/locations/district.service";
import { ShowDialogProps } from "@/types/common";
import { District } from "@/types/locations/district";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DistrictShowDialog = ({ isOpen, onClose, uuid }: ShowDialogProps) => {
	const t = useTranslations();
	const [district, setDistrict] = useState<District | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen && uuid) {
			setIsLoading(true);
			districtService
				.showDistrict(uuid)
				.then((response) => {
					setDistrict(response.data);
				})
				.catch((error) => {
					toast.error(
						error instanceof Error
							? error.message
							: "Failed to load district data"
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
			title={t("navigation.menu.locations.districts.show")}
			description={t("navigation.description.show", {
				page: t("navigation.menu.locations.districts.label"),
			})}
			icon={<Info />}
		>
			{isLoading ? (
				<LoadingSpinner />
			) : district ? (
				<GridContainer>
					<GridItem
						label={t("input.common.code.label")}
						value={district.code}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.meta.full_code.label")}
						value={district.full_code}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.location.district.label")}
						value={district.name}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.regency_name.label")}
						value={`${district.regency.type} ${district.regency.name}`}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.province_name.label")}
						value={district.regency.province.name}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.meta.created_at.label")}
						value={district.created_at.formatted}
						className="text-center"
					/>
					<GridItem
						label={t("input.meta.updated_at.label")}
						value={district.updated_at.formatted}
						className="text-center"
					/>
				</GridContainer>
			) : null}
		</DynamicDialog>
	);
};

export default DistrictShowDialog;
