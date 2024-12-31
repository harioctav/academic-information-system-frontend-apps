import { DynamicInput } from "@/components/forms/dynamic-input";
import { Label } from "@/components/ui/label";
import { StudentRequest } from "@/types/academics/student";
import { useTranslations } from "next-intl";
import { DatePicker } from "@/components/ui/date-picker";
import { getGenderTypeOptions } from "@/config/enums/gender.type.enum";
import { DynamicSelectRS } from "@/components/forms/dynamic-select-react";

interface BirthStatusStepProps {
	formData: StudentRequest;
	setFormData: (data: StudentRequest) => void;
	errors: Record<string, string[]>;
	isLoading: boolean;
}

const BirthStatusStep = ({
	formData,
	setFormData,
	errors,
	isLoading,
}: BirthStatusStepProps) => {
	const t = useTranslations();

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<DynamicInput
				type="text"
				name="nik"
				label={t("input.common.nik.label")}
				value={formData.nik || ""}
				onChange={(value) => setFormData({ ...formData, nik: value })}
				error={errors.nik?.[0]}
				disabled={isLoading}
			/>

			<div className="space-y-2">
				<Label htmlFor="gender" className="block text-sm font-medium mb-2">
					{t("input.common.gender.label")}
				</Label>
				<DynamicSelectRS
					value={formData.gender}
					onChange={(value) =>
						setFormData({ ...formData, gender: value || "" })
					}
					options={getGenderTypeOptions(t)}
					placeholder={t("input.select")}
					error={errors.gender?.[0]}
					disabled={isLoading}
				/>
				{errors.type && (
					<span className="text-sm text-red-500">{errors.type}</span>
				)}
			</div>

			<DynamicInput
				type="text"
				name="birth_place"
				label={t("input.common.birth_place.label")}
				value={formData.birth_place || ""}
				onChange={(value) => setFormData({ ...formData, birth_place: value })}
				error={errors.birth_place?.[0]}
				disabled={isLoading}
			/>

			<div className="space-y-2">
				<Label htmlFor="birth_date">{t("input.common.birth_date.label")}</Label>
				<DatePicker
					date={formData.birth_date}
					onSelect={(date) => setFormData({ ...formData, birth_date: date })}
					disabled={isLoading}
					placeholder={t("input.common.birth_date.placeholder")}
					maxDate={new Date()}
				/>
				{errors.birth_date && (
					<span className="text-sm text-red-500">{errors.birth_date[0]}</span>
				)}
			</div>
		</div>
	);
};

export default BirthStatusStep;
