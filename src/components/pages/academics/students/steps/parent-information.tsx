import { DynamicInput } from "@/components/forms/dynamic-input";
import { PhoneInput } from "@/components/forms/phone-input";
import { StudentRequest } from "@/types/academics/student";
import { useTranslations } from "next-intl";

interface ParentInformationStepProps {
	formData: StudentRequest;
	setFormData: (data: StudentRequest) => void;
	errors: Record<string, string[]>;
	isLoading: boolean;
}

const ParentInformationStep = ({
	formData,
	setFormData,
	errors,
	isLoading,
}: ParentInformationStepProps) => {
	const t = useTranslations();

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<DynamicInput
				type="text"
				name="parent_name"
				label={t("input.common.parent_name.label")}
				value={formData.parent_name || ""}
				onChange={(value) => setFormData({ ...formData, parent_name: value })}
				error={errors.parent_name?.[0]}
				disabled={isLoading}
			/>

			<PhoneInput
				value={formData.parent_phone_number ?? ""}
				onChange={(value) =>
					setFormData({ ...formData, parent_phone_number: value })
				}
				error={errors.parent_phone_number?.[0]}
				disabled={isLoading}
			/>
		</div>
	);
};

export default ParentInformationStep;
