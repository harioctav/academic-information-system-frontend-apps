"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { provinceService } from "@/lib/services/locations/province.service";
import { ApiError, ValidationErrors } from "@/types/api";
import { ProvinceRequest } from "@/types/locations/province";
import { FormProps } from "@/types/from-prop";
import { useRouter } from "next/navigation";
import React, { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const ProvinceFormInput = ({ uuid, isEdit }: FormProps) => {
	const router = useRouter();
	const t = useTranslations();
	const [code, setCode] = React.useState("");
	const [name, setName] = React.useState("");
	const [errors, setErrors] = React.useState<ValidationErrors>({});
	const [isLoading, setIsLoading] = React.useState(false);

	const loadProvinceData = useCallback(async () => {
		if (!uuid) return;

		try {
			const response = await provinceService.showProvince(uuid);
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

			router.push("/locations/provinces");
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
						<Label htmlFor="code" className="block text-sm font-medium mb-2">
							{t("input.code.label")}
						</Label>
						<Input
							type="number"
							min="0"
							id="code"
							name="code"
							placeholder={t("input.code.placeholder")}
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
							{t("input.name.label")}
						</Label>
						<Input
							type="text"
							id="name"
							name="name"
							placeholder={t("input.name.placeholder")}
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full"
						/>
						{errors.name && (
							<span className="text-sm text-red-500">{errors.name[0]}</span>
						)}
					</div>

					<SubmitButton type="submit" className="w-full" isLoading={isLoading}>
						{isEdit ? t("button.edit") : t("button.create")}
					</SubmitButton>
				</div>
			</form>
		</div>
	);
};

export default ProvinceFormInput;
