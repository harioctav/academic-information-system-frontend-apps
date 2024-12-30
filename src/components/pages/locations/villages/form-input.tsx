"use client";

import { DynamicInput } from "@/components/forms/dynamic-input";
import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { CustomFormatter } from "@/components/ui/async-select-formatter";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { villageService } from "@/lib/services/locations/village.service";
import { ApiError, ValidationErrors } from "@/types/api";
import { FormProps } from "@/types/common";
import { District } from "@/types/locations/district";
import { VillageRequest } from "@/types/locations/village";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const VillageFormInput = ({ uuid, isEdit, onSuccess }: FormProps) => {
	const t = useTranslations();
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [posCode, setPosCode] = useState("");
	const [selectedDistrict, setSelectedDistrict] =
		useState<SelectOption<District> | null>(null);

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
				await villageService.updateVillage(uuid, villageRequest);
			} else {
				await villageService.storeVillage(villageRequest);
			}

			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			const apiError = error as ApiError;
			if (apiError.errors) {
				setErrors(apiError.errors);
			}
			toast.error(
				apiError.message || "An error occurred while saving the village"
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
							apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/options/locations/districts`}
							value={selectedDistrict}
							onChange={(newValue) => setSelectedDistrict(newValue)}
							onClear={() => setSelectedDistrict(null)}
							textFormatter={(item) => (
								<CustomFormatter
									mainText={item.name}
									subText={`${item.regency.type} ${item.regency.name}`}
								/>
							)}
							isClearable
						/>
						{errors.districts && (
							<span className="text-sm text-red-500">{errors.districts}</span>
						)}
					</div>

					<DynamicInput
						type="number"
						name="code"
						label={t("input.common.code.label")}
						value={code}
						onChange={setCode}
						error={errors.code?.[0]}
						disabled={isLoading}
						min={1}
					/>

					<DynamicInput
						type="text"
						name="name"
						label={t("input.common.name.label")}
						value={name}
						onChange={setName}
						error={errors.name?.[0]}
						disabled={isLoading}
					/>

					<DynamicInput
						type="number"
						name="pos_code"
						label={t("input.common.pos_code.label")}
						value={posCode}
						onChange={setPosCode}
						error={errors.posCode?.[0]}
						disabled={isLoading}
					/>

					<SubmitButton type="submit" className="w-full" isLoading={isLoading}>
						{isEdit ? t("button.common.edit") : t("button.common.create")}
					</SubmitButton>
				</div>
			</form>
		</div>
	);
};

export default VillageFormInput;
