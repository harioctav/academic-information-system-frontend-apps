"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { villageService } from "@/lib/services/locations/village.service";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Village } from "@/types/locations/village";
import { toast } from "sonner";

interface VillageShowDialogProps {
	isOpen: boolean;
	onClose: () => void;
	uuid?: string;
}

export function VillageShowDialog({
	isOpen,
	onClose,
	uuid,
}: VillageShowDialogProps) {
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
				<div className="space-y-4">
					<div>
						<label className="font-semibold">
							{t("input.province_name.label")}
						</label>
						<p>{village.district.regency.province.name}</p>
					</div>
					<div>
						<label className="font-semibold">
							{t("input.regency_name.label")}
						</label>
						<p>{`${village.district.regency.type} ${village.district.regency.name}`}</p>
					</div>
					<div>
						<label className="font-semibold">
							{t("input.district_name.label")}
						</label>
						<p>{village.district.name}</p>
					</div>
					<div>
						<label className="font-semibold">
							{t("input.common.name.label")}
						</label>
						<p>{village.name}</p>
					</div>
					<div>
						<label className="font-semibold">
							{t("input.common.code.label")}
						</label>
						<p>{village.code}</p>
					</div>
					<div>
						<label className="font-semibold">
							{t("input.meta.full_code.label")}
						</label>
						<p>{village.full_code}</p>
					</div>
					<div>
						<label className="font-semibold">
							{t("input.location.pos_code.label")}
						</label>
						<p>{village.pos_code || "-"}</p>
					</div>
				</div>
			) : null}
		</DynamicDialog>
	);
}
