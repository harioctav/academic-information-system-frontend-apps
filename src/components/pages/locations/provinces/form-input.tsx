"use client";

import { SubmitButton } from "@/components/ui/submit-button";
import { provinceService } from "@/lib/services/locations/province.service";
import { ApiError, ValidationErrors } from "@/types/api";
import { ProvinceRequest } from "@/types/locations/province";
import { useRouter } from "next/navigation";
import { useEffect, useCallback, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { FormProps } from "@/types/common";
import { DynamicInput } from "@/components/forms/dynamic-input";
import { locationOptionService } from "@/lib/services/options/location.option.service";

const ProvinceFormInput = ({ uuid, isEdit, onSuccess }: FormProps) => {
	const router = useRouter();
	const t = useTranslations();
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isLoading, setIsLoading] = useState(false);

	const loadProvinceData = useCallback(async () => {
		if (!uuid) return;

		try {
			const response = await locationOptionService.showProvince(uuid);
			setCode(response.data.code.toString());
			setName(response.data.name);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to load province data"
			);
		}
	}, [uuid]);

	useEffect(() => {
		if (isEdit && uuid) {
			loadProvinceData();
		}
	}, [isEdit, uuid, loadProvinceData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});

		const provinceData: ProvinceRequest = {
			code: parseInt(code),
			name: name,
		};

		try {
			if (isEdit && uuid) {
				const response = await provinceService.updateProvince(
					uuid,
					provinceData
				);
				toast.success(response.message);
			} else {
				const response = await provinceService.storeProvince(provinceData);
				toast.success(response.message);
			}

			if (onSuccess) {
				onSuccess();
			}

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
		<div className="w-full max-w-md mx-auto py-3">
			<form onSubmit={handleSubmit}>
				<div className="grid gap-6">
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

export default ProvinceFormInput;
