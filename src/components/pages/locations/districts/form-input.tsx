"use client";

import { DynamicInput } from "@/components/forms/dynamic-input";
import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { districtService } from "@/lib/services/locations/district.service";
import { locationOptionService } from "@/lib/services/options/location.option.service";
import { ApiError, ValidationErrors } from "@/types/api";
import { FormProps } from "@/types/common";
import { DistrictRequest } from "@/types/locations/district";
import { Regency } from "@/types/locations/regency";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const DistrictFormInput = ({ uuid, isEdit, onSuccess }: FormProps) => {
	const t = useTranslations();
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [selectedRegency, setSelectedRegency] =
		useState<SelectOption<Regency> | null>(null);

	const router = useRouter();
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isLoading, setIsLoading] = useState(false);

	const districtShowLoad = useCallback(async () => {
		if (!uuid) return;

		try {
			const response = await locationOptionService.showDistrict(uuid);
			setCode(response.data.code.toString());
			setName(response.data.name);
			setSelectedRegency({
				value: response.data.regency.id,
				label: `${response.data.regency.type} ${response.data.regency.name}`,
				data: response.data.regency,
			});
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to load province data"
			);
		}
	}, [uuid]);

	useEffect(() => {
		if (isEdit && uuid) {
			districtShowLoad();
		}
	}, [isEdit, uuid, districtShowLoad]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});

		const request: DistrictRequest = {
			code: parseInt(code),
			name: name,
			regencies: parseInt(String(selectedRegency?.value)),
		};

		try {
			if (isEdit && uuid) {
				const response = await districtService.updateDistrict(uuid, request);
				if (response.success) {
					toast.success(response.message);
					if (onSuccess) onSuccess();
					router.refresh();
				}
			} else {
				const response = await districtService.storeDistrict(request);
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
				apiError.message || "An error occurred while saving the District"
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
							htmlFor="regencies"
							className="block text-sm font-medium mb-2"
						>
							{t("input.regency_name.label")}
						</Label>
						<AsyncSelectInput<Regency>
							placeholder={t("input.select")}
							apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/options/locations/regencies`}
							value={selectedRegency}
							onChange={(newValue) => setSelectedRegency(newValue)}
							onClear={() => setSelectedRegency(null)}
							textFormatter={(item) => `${item.type} ${item.name}`}
							isClearable
						/>
						{errors.regencies && (
							<span className="text-sm text-red-500">{errors.regencies}</span>
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

					<SubmitButton type="submit" className="w-full" isLoading={isLoading}>
						{isEdit ? t("button.common.edit") : t("button.common.create")}
					</SubmitButton>
				</div>
			</form>
		</div>
	);
};

export default DistrictFormInput;
