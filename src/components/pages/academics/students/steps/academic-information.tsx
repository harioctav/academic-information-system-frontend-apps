import { DynamicInput } from "@/components/forms/dynamic-input";
import { DynamicSelect } from "@/components/forms/dynamic-select";
import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getStatusOptions } from "@/config/enums/status.enum";
import { getStatusRegistrationOptions } from "@/config/enums/status.registration.enum";
import { academicOptionService } from "@/lib/services/options/academic.option.service";
import { Major } from "@/types/academics/major";
import { StudentRequest } from "@/types/academics/student";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface AcademicInformationStepProps {
	formData: StudentRequest;
	setFormData: (data: StudentRequest) => void;
	errors: Record<string, string[]>;
	isLoading: boolean;
}

const AcademicInformationStep = ({
	formData,
	setFormData,
	errors,
	isLoading,
}: AcademicInformationStepProps) => {
	const t = useTranslations();

	const initialLoadDone = useRef(false);
	const [selectedMajor, setSelectedMajor] =
		useState<SelectOption<Major> | null>(null);

	useEffect(() => {
		const loadInitialMajor = async () => {
			if (formData.major && !initialLoadDone.current) {
				try {
					const response = await academicOptionService.getMajors({
						page: 1,
						perPage: 1,
						sortBy: "id",
						sortDirection: "asc",
						filters: {
							id: formData.major.toString(),
						},
					});

					if (response.data && response.data.length > 0) {
						const major = response.data[0];
						setSelectedMajor({
							label: major.name,
							value: major.uuid,
							data: major,
						});
						initialLoadDone.current = true;
					}
				} catch (error) {
					console.error("Failed to load major data:", error);
				}
			}
		};

		loadInitialMajor();
	}, [formData.major]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<DynamicInput
				type="text"
				name="initial_registration_period"
				label={t("input.common.initial_registration_period.label")}
				value={formData.initial_registration_period || ""}
				onChange={(value) =>
					setFormData({ ...formData, initial_registration_period: value })
				}
				error={errors.initial_registration_period?.[0]}
				disabled={isLoading}
			/>

			<DynamicInput
				type="text"
				name="origin_department"
				label={t("input.common.origin_department.label")}
				value={formData.origin_department || ""}
				onChange={(value) =>
					setFormData({ ...formData, origin_department: value })
				}
				error={errors.origin_department?.[0]}
				disabled={isLoading}
			/>

			<DynamicInput
				type="text"
				name="upbjj"
				label={t("input.common.upbjj.label")}
				value={formData.upbjj || ""}
				onChange={(value) => setFormData({ ...formData, upbjj: value })}
				error={errors.upbjj?.[0]}
				disabled={isLoading}
			/>

			<div className="space-y-2">
				<Label htmlFor="major" className="block text-sm font-medium mb-2">
					{t("module.academic.majors")}
				</Label>
				<AsyncSelectInput<Major>
					placeholder={t("input.select")}
					apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/options/academics/majors`}
					value={selectedMajor}
					onChange={(newValue) => {
						setSelectedMajor(newValue);
						setFormData({ ...formData, major: newValue?.data.id || 0 });
					}}
					onClear={() => {
						setSelectedMajor(null);
						setFormData({ ...formData, major: 0 });
					}}
					textFormatter={(item) => item.name}
					valueFormatter={(item) => item.id}
					isClearable
				/>
				{errors.major && (
					<span className="text-sm text-red-500">{errors.major[0]}</span>
				)}
			</div>

			<div className="space-y-2">
				<Label
					htmlFor="status_registration"
					className="block text-sm font-medium mb-2"
				>
					{t("input.common.status_registration.label")}
				</Label>
				<DynamicSelect
					value={formData.status_registration || ""}
					onChange={(value) =>
						setFormData({ ...formData, status_registration: value })
					}
					options={getStatusRegistrationOptions()}
					placeholder={t("input.select")}
					error={errors.status_registration?.[0]}
					disabled={isLoading}
				/>
			</div>

			<div className="space-y-2">
				<Label>{t("input.common.status_activity.label")}</Label>
				<RadioGroup
					className="grid gap-2"
					value={formData.status_activity?.toString() || undefined}
					onValueChange={(value) =>
						setFormData({ ...formData, status_activity: parseInt(value) })
					}
				>
					{getStatusOptions(t).map((option) => (
						<div key={option.value} className="flex items-center space-x-2">
							<RadioGroupItem
								value={option.value}
								id={`status-${option.value}`}
								disabled={isLoading}
							/>
							<Label htmlFor={`status-${option.value}`} className="font-normal">
								{option.label}
							</Label>
						</div>
					))}
				</RadioGroup>
				{errors.status_activity && (
					<span className="text-sm text-red-500">
						{errors.status_activity[0]}
					</span>
				)}
			</div>
		</div>
	);
};

export default AcademicInformationStep;
