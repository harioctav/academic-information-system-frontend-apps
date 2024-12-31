import { DynamicInput } from "@/components/forms/dynamic-input";
import { DynamicSelectRS } from "@/components/forms/dynamic-select-react";
import ImageInput from "@/components/forms/image-input";
import { PhoneInput } from "@/components/forms/phone-input";
import { Label } from "@/components/ui/label";
import { getReligionOptions } from "@/config/enums/religion.type";
import { StudentRequest } from "@/types/academics/student";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface BasicInformationStepProps {
	formData: StudentRequest;
	setFormData: (data: StudentRequest) => void;
	errors: Record<string, string[]>;
	isLoading: boolean;
	photoUrl?: string | null;
}

const BasicInformationStep = ({
	formData,
	setFormData,
	errors,
	isLoading,
	photoUrl,
}: BasicInformationStepProps) => {
	const t = useTranslations();
	const [imagePreview, setImagePreview] = useState<string | null>(() => {
		if (formData.student_photo_path instanceof File) {
			return URL.createObjectURL(formData.student_photo_path);
		}
		return photoUrl || null;
	});

	useEffect(() => {
		if (formData.student_photo_path instanceof File) {
			const objectUrl = URL.createObjectURL(formData.student_photo_path);
			setImagePreview(objectUrl);
			return () => URL.revokeObjectURL(objectUrl);
		}
	}, [formData.student_photo_path]);

	return (
		<div className="w-full">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Image input centered and spanning full width */}
				<div className="col-span-full md:col-span-2 max-w-md w-full">
					<div className="space-y-2">
						<Label htmlFor="photo" className="block text-sm font-medium mb-2">
							{t("input.user.photo.label")}
						</Label>

						<ImageInput
							value={imagePreview}
							onChange={(file) => {
								setFormData({ ...formData, student_photo_path: file });
								setImagePreview(file ? URL.createObjectURL(file) : null);
							}}
							onRemove={() => {
								setFormData({ ...formData, student_photo_path: undefined });
								setImagePreview(null);
							}}
							name={formData.name}
							disabled={isLoading}
							fallback={formData.name.charAt(0)}
						/>

						{errors.student_photo_path && (
							<span className="text-sm text-red-500">
								{errors.student_photo_path[0]}
							</span>
						)}
					</div>
				</div>

				<DynamicInput
					type="number"
					name="nim"
					label={t("input.common.nim.label")}
					value={formData.nim}
					onChange={(value) => setFormData({ ...formData, nim: value })}
					error={errors.nim?.[0]}
					disabled={isLoading}
				/>

				<DynamicInput
					type="text"
					name="name"
					label={t("input.common.name.label")}
					value={formData.name}
					onChange={(value) => setFormData({ ...formData, name: value })}
					error={errors.name?.[0]}
					disabled={isLoading}
				/>

				<DynamicInput
					type="email"
					name="email"
					label={t("input.user.email.label")}
					value={formData.email || ""}
					onChange={(value) => setFormData({ ...formData, email: value })}
					error={errors.email?.[0]}
					disabled={isLoading}
				/>

				<PhoneInput
					value={formData.phone ?? ""}
					onChange={(value) => setFormData({ ...formData, phone: value })}
					error={errors.phone?.[0]}
					disabled={isLoading}
				/>

				<div className="space-y-2">
					<Label htmlFor="religion" className="block text-sm font-medium mb-2">
						{t("input.common.religion.label")}
					</Label>
					<DynamicSelectRS
						value={formData.religion}
						onChange={(value) =>
							setFormData({ ...formData, religion: value || "" })
						}
						options={getReligionOptions()}
						placeholder={t("input.select")}
						error={errors.religion?.[0]}
						disabled={isLoading}
					/>
				</div>
			</div>
		</div>
	);
};

export default BasicInformationStep;
