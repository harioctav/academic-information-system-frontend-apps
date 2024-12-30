"use client";

import { CodeInput } from "@/components/forms/code-input";
import { NameInput } from "@/components/forms/name-input";
import { DynamicSelect } from "@/components/forms/dynamic-select";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { getDegreeOptions } from "@/config/enums/degree.type.enum";
import { majorService } from "@/lib/services/academics/major.service";
import { MajorRequest } from "@/types/academics/major";
import { ApiError, ValidationErrors } from "@/types/api";
import { FormProps } from "@/types/common";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { toast } from "sonner";

const MajorFormInput = ({ uuid, isEdit, onSuccess }: FormProps) => {
	const router = useRouter();
	const t = useTranslations();
	const [code, setCode] = React.useState("");
	const [name, setName] = React.useState("");
	const [degree, setDegree] = React.useState("");
	const [errors, setErrors] = React.useState<ValidationErrors>({});
	const [isLoading, setIsLoading] = React.useState(false);

	const LoadMajorData = useCallback(async () => {
		if (!uuid) return;

		try {
			const response = await majorService.showMajor(uuid);
			setCode(response.data.code.toString());
			setName(response.data.name);
			setDegree(response.data.degree);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to load major data"
			);
		}
	}, [uuid]);

	useEffect(() => {
		if (isEdit && uuid) {
			LoadMajorData();
		}
	}, [isEdit, uuid, LoadMajorData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});

		const request: MajorRequest = {
			code: parseInt(code),
			name: name,
			degree: degree,
		};

		try {
			if (isEdit && uuid) {
				const response = await majorService.updateMajor(uuid, request);
				toast.success(response.message);
			} else {
				const response = await majorService.storeMajor(request);
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
				apiError.message || "An error occurred while saving the Major"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto py-3">
			<form onSubmit={handleSubmit}>
				<div className="grid gap-6">
					<CodeInput
						value={code}
						onChange={(value) => setCode(value)}
						error={errors.code?.[0]}
						disabled={isLoading}
					/>

					<NameInput
						value={name}
						onChange={(value) => setName(value)}
						error={errors.name?.[0]}
						disabled={isLoading}
					/>

					<div className="space-y-2">
						<Label htmlFor="degree" className="block text-sm font-medium mb-2">
							{t("input.common.degree.label")}
						</Label>
						<DynamicSelect
							value={degree}
							onChange={(value) => setDegree(value || "")}
							options={getDegreeOptions()}
							placeholder={t("input.select")}
						/>
						{errors.degree && (
							<span className="text-sm text-red-500">{errors.degree}</span>
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

export default MajorFormInput;
