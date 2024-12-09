"use client";

import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { villageService } from "@/lib/services/locations/village.service";
import { ApiError, ValidationErrors } from "@/types/api";
import { FormProps } from "@/types/from-prop";
import { District } from "@/types/locations/district";
import { VillageRequest } from "@/types/locations/village";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const VillageFormInput = ({ uuid, isEdit }: FormProps) => {
	const t = useTranslations();
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [posCode, setPosCode] = useState("");
	const [selectedDistrict, setSelectedDistrict] =
		useState<SelectOption<District> | null>(null);

	const router = useRouter();
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isLoading, setIsLoading] = useState(false);

	const villageShowLoad = useCallback(async () => {
		if (!uuid) return;

		try {
			const response = await villageService.showVillage(uuid);
			setCode(response.data.code.toString());
			setName(response.data.name);
			setPosCode(response.data.pos_code);
			setSelectedDistrict({
				value: response.data.district.id,
				label: response.data.district.name,
				data: response.data.district,
			});
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to load province data"
			);
		}
	}, [uuid]);

	useEffect(() => {
		if (isEdit && uuid) {
			villageShowLoad();
		}
	}, [isEdit, uuid, villageShowLoad]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});

		const villageRequest: VillageRequest = {
			code: parseInt(code),
			name: name,
			pos_code: parseInt(posCode),
			districts: parseInt(String(selectedDistrict?.value)),
		};

		try {
			if (isEdit && uuid) {
				const response = await villageService.updateVillage(
					uuid,
					villageRequest
				);
				toast.success(response.message);
			} else {
				const response = await villageService.storeVillage(villageRequest);
				toast.success(response.message);
			}

			router.push("/locations/villages");
			router.refresh();
		} catch (error) {
			const apiError = error as ApiError;
			if (apiError.errors) {
				setErrors(apiError.errors);
			}
			toast.error(
				apiError.message || "An error occurred while saving the province"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto py-6">
			<form onSubmit={handleSubmit}>
				<div className="grid gap-6">
					<div className="space-y-2">
						<Label
							htmlFor="districts"
							className="block text-sm font-medium mb-2"
						>
							{t("input.district_name.label")}
						</Label>
						<AsyncSelectInput<District>
							placeholder={t("input.select")}
							apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/locations/districts`}
							value={selectedDistrict}
							onChange={(newValue) => setSelectedDistrict(newValue)}
							onClear={() => setSelectedDistrict(null)}
							textFormatter={(item) =>
								`${item.name} - ${item.regency.type} ${item.regency.name}`
							}
							isClearable
						/>
						{errors.districts && (
							<span className="text-sm text-red-500">{errors.districts}</span>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="code" className="block text-sm font-medium mb-2">
							{t("input.common.code.label")}
						</Label>
						<Input
							type="number"
							min="0"
							id="code"
							name="code"
							placeholder={t("input.common.code.placeholder")}
							value={code}
							onChange={(e) => setCode(e.target.value)}
							className="w-full"
						/>
						{errors.code && (
							<span className="text-sm text-red-500">{errors.code[0]}</span>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="name" className="block text-sm font-medium mb-2">
							{t("input.common.name.label")}
						</Label>
						<Input
							type="text"
							id="name"
							name="name"
							placeholder={t("input.common.name.placeholder")}
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full"
						/>
						{errors.name && (
							<span className="text-sm text-red-500">{errors.name[0]}</span>
						)}
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="pos_code"
							className="block text-sm font-medium mb-2"
						>
							{t("input.location.pos_code.label")}
						</Label>
						<Input
							type="number"
							min="0"
							id="pos_code"
							name="pos_code"
							placeholder={t("input.location.pos_code.placeholder")}
							value={posCode}
							onChange={(e) => setPosCode(e.target.value)}
							className="w-full"
						/>
						{errors.posCode && (
							<span className="text-sm text-red-500">{errors.posCode[0]}</span>
						)}
					</div>

					<SubmitButton type="submit" className="w-full" isLoading={isLoading}>
						{isEdit ? t("button.common.edit") : t("button.common.create")}
					</SubmitButton>
				</div>
			</form>
		</div>
	);
};

export default VillageFormInput;
