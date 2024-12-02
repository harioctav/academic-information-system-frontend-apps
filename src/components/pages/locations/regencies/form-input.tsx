"use client";

import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { DynamicSelect } from "@/components/ui/dynamic-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { RegencyType } from "@/config/enums/regency.type.enum";
import { regencyService } from "@/lib/services/locations/regency.service";
import { ApiError, ValidationErrors } from "@/types/api";
import { FormProps } from "@/types/from-prop";
import { Province } from "@/types/locations/province";
import { RegencyRequest } from "@/types/locations/regency";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const RegencyFormInput = ({ uuid, isEdit }: FormProps) => {
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
			const response = await regencyService.showRegency(uuid);
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

		const regencyRequest: RegencyRequest = {
			code: parseInt(code),
			name: name,
			type: type,
			provinces: parseInt(String(selectedProvince?.value)),
		};

		try {
			if (isEdit && uuid) {
				const response = await regencyService.updateRegency(
					uuid,
					regencyRequest
				);
				toast.success(response.message);
			} else {
				const response = await regencyService.storeRegency(regencyRequest);
				toast.success(response.message);
			}

			router.push("/locations/regencies");
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
					{/* Province Select */}
					<div className="space-y-2">
						<Label
							htmlFor="provinces"
							className="block text-sm font-medium mb-2"
						>
							{t("input.province_name.label")}
						</Label>
						<AsyncSelectInput<Province>
							placeholder={t("input.province_name.placeholder")}
							apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/locations/provinces`}
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

					{/* Type */}
					<div className="space-y-2">
						<Label htmlFor="type" className="block text-sm font-medium mb-2">
							{t("input.type.label")}
						</Label>
						<DynamicSelect
							value={type}
							onChange={(value) => setType(value || "")}
							options={regencyTypeOptions}
							placeholder={t("input.type.placeholder")}
						/>
						{errors.type && (
							<span className="text-sm text-red-500">{errors.type}</span>
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

export default RegencyFormInput;