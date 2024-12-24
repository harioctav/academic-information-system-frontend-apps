"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import ListContainer from "@/components/ui/list-container";
import { ListItem } from "@/components/ui/list-item";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { districtService } from "@/lib/services/locations/district.service";
import { ShowDialogProps } from "@/types/common";
import { District } from "@/types/locations/district";
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
			description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, cum?"
		>
			{isLoading ? (
				<LoadingSpinner />
			) : district ? (
				<ListContainer>
					<ListItem
						label={t("input.common.code.label")}
						value={district.code}
					/>
					<ListItem
						label={t("input.meta.full_code.label")}
						value={district.full_code}
					/>
					<ListItem
						label={t("input.location.district.label")}
						value={district.name}
					/>
					<ListItem
						label={t("input.regency_name.label")}
						value={`${district.regency.type} ${district.regency.name}`}
					/>
					<ListItem
						label={t("input.province_name.label")}
						value={district.regency.province.name}
					/>
					<ListItem
						label={t("input.meta.created_at.label")}
						value={district.created_at.formatted}
					/>
					<ListItem
						label={t("input.meta.updated_at.label")}
						value={district.updated_at.formatted}
					/>
				</ListContainer>
			) : null}
		</DynamicDialog>
	);
};

export default DistrictShowDialog;
