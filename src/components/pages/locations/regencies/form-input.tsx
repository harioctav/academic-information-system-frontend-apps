"use client";

import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { RegencyType } from "@/config/enums/regency.type.enum";
import { regencyService } from "@/lib/services/locations/regency.service";
import { ApiError, ValidationErrors } from "@/types/api";
import { FormProps } from "@/types/common";
import { Province } from "@/types/locations/province";
import { RegencyRequest } from "@/types/locations/regency";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { DynamicInput } from "@/components/forms/dynamic-input";
import { locationOptionService } from "@/lib/services/options/location.option.service";
import { DynamicSelectRS } from "@/components/forms/dynamic-select-react";

const RegencyFormInput = ({ uuid, isEdit, onSuccess }: FormProps) => {
	const t = useTranslations();
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [selectedProvince, setSelectedProvince] =
		useState<SelectOption<Province> | null>(null);

	const regencyTypeOptions = [
		{ value: RegencyType.Kota, label: RegencyType.Kota },
		{ value: RegencyType.Kabupaten, label: RegencyType.Kabupaten },
	];

	const router = useRouter();
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isLoading, setIsLoading] = useState(false);

	const regencyShowLoad = useCallback(async () => {
		if (!uuid) return;

		try {
			const response = await locationOptionService.showRegency(uuid);
			setCode(response.data.code.toString());
			setName(response.data.name);
			setType(response.data.type);
			setSelectedProvince({
				value: response.data.province.id,
				label: response.data.province.name,
				data: response.data.province,
			});
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to load province data"
			);
		}
	}, [uuid]);

	useEffect(() => {
		if (isEdit && uuid) {
			regencyShowLoad();
		}
	}, [isEdit, uuid, regencyShowLoad]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});

		const request: RegencyRequest = {
			code: parseInt(code),
			name: name,
			type: type,
			provinces: parseInt(String(selectedProvince?.value)),
		};

		try {
			if (isEdit && uuid) {
				const response = await regencyService.updateRegency(uuid, request);
				if (response.success) {
					toast.success(response.message);
					if (onSuccess) onSuccess();
					router.refresh();
				}
			} else {
				const response = await regencyService.storeRegency(request);
				if (response.success) {
					toast.success(response.message);
					if (onSuccess) onSuccess();
					router.refresh();
				}
			}
		} catch (error) {
			const apiError = error as ApiError;
			if (apiError.errors) {
				setErrors(apiError.errors);
			}
			toast.error(
				apiError.message || "An error occurred while saving the Regency"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto py-6">
			<form onSubmit={handleSubmit}>
				<div className="grid gap-6">
					{/* Province Select */}
					<div className="space-y-2">
						<Label
							htmlFor="provinces"
							className="block text-sm font-medium mb-2"
						>
							{t("input.location.province.label")}
						</Label>
						<AsyncSelectInput<Province>
							placeholder={t("input.select")}
							apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/options/locations/provinces`}
							value={selectedProvince}
							onChange={(newValue) => setSelectedProvince(newValue)}
							onClear={() => setSelectedProvince(null)}
							textFormatter={(item) => item.name}
							isClearable
						/>
						{errors.provinces && (
							<span className="text-sm text-red-500">{errors.provinces}</span>
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

					{/* Type */}
					<div className="space-y-2">
						<Label htmlFor="type" className="block text-sm font-medium mb-2">
							{t("input.common.type.label")}
						</Label>
						<DynamicSelectRS
							value={type}
							onChange={(value) => setType(value || "")}
							options={regencyTypeOptions}
							placeholder={t("input.common.type.placeholder")}
						/>
						{errors.type && (
							<span className="text-sm text-red-500">{errors.type}</span>
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

export default RegencyFormInput;
