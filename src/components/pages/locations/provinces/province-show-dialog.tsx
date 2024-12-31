"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { GridContainer } from "@/components/ui/grid-container";
import { GridItem } from "@/components/ui/grid-item";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { provinceService } from "@/lib/services/locations/province.service";
import { ShowDialogProps } from "@/types/common";
import { Province } from "@/types/locations/province";
import { Info } from "lucide-react";
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
			description={t("navigation.description.show", {
				page: t("navigation.menu.locations.provinces.label"),
			})}
			icon={<Info />}
		>
			{isLoading ? (
				<LoadingSpinner />
			) : province ? (
				<GridContainer>
					<GridItem
						label={t("input.common.code.label")}
						value={province.code}
						fullWidth
						className="text-center"
					/>
					<GridItem
						label={t("input.location.province.label")}
						value={province.name}
						fullWidth
						className="text-center"
					/>
					<GridItem
						label={t("input.meta.created_at.label")}
						value={province.created_at.formatted}
						className="text-center"
					/>
					<GridItem
						label={t("input.meta.updated_at.label")}
						value={province.updated_at.formatted}
						className="text-center"
					/>
				</GridContainer>
			) : null}
		</DynamicDialog>
	);
};

export default ProvinceShowDialog;
