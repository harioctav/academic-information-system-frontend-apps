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
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="text-sm text-muted-foreground block">
							{t("input.province_name.label")}
						</label>
						<p className="font-semibold">
							{village.district.regency.province.name}
						</p>
					</div>

					<div className="space-y-2">
						<label className="text-sm text-muted-foreground block">
							{t("input.regency_name.label")}
						</label>
						<p className="font-semibold">{`${village.district.regency.type} ${village.district.regency.name}`}</p>
					</div>

					<div className="space-y-2">
						<label className="text-sm text-muted-foreground block">
							{t("input.district_name.label")}
						</label>
						<p className="font-semibold">{village.district.name}</p>
					</div>

					<div className="space-y-2">
						<label className="text-sm text-muted-foreground block">
							{t("input.location.village.label")}
						</label>
						<p className="font-semibold">{village.name}</p>
					</div>

					<div className="space-y-2">
						<label className="text-sm text-muted-foreground block">
							{t("input.common.code.label")}
						</label>
						<p className="font-semibold">{village.code}</p>
					</div>

					<div className="space-y-2">
						<label className="text-sm text-muted-foreground block">
							{t("input.meta.full_code.label")}
						</label>
						<p className="font-semibold">{village.full_code}</p>
					</div>

					<div className="space-y-2 md:col-span-2">
						<label className="text-sm text-muted-foreground block">
							{t("input.location.pos_code.label")}
						</label>
						<p className="font-semibold">{village.pos_code || "-"}</p>
					</div>
				</div>
			) : null}
		</DynamicDialog>
	);
}
