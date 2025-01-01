"use client";

import { DynamicInput } from "@/components/forms/dynamic-input";
import { PhoneInput } from "@/components/forms/phone-input";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import UploadImage from "@/components/ui/upload-image";
import { accountService } from "@/lib/services/accounts/account.service";
import { ApiError, ValidationErrors } from "@/types/api";
import { User, UserRequest } from "@/types/settings/user";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface UpdateProfileFormProps {
	user: User;
	onSuccess?: () => Promise<void>;
}

const UpdateProfileForm = ({ user, onSuccess }: UpdateProfileFormProps) => {
	const t = useTranslations();
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [formData, setFormData] = useState<UserRequest>({
		name: user.name || "",
		email: user.email || "",
		phone: user.phone || "",
		roles: user.roles?.[0]?.id || 0,
		photo: undefined,
	});

	const handleDeleteImage = () => {
		if (user.photo_url) {
			setShowDeleteConfirmation(true);
		} else {
			setFormData({ ...formData, photo: undefined });
		}
	};

	const confirmDeleteImage = async () => {
		setIsLoading(true);
		try {
			const response = await accountService.deleteUserImage(user.uuid);
			if (response.code === 200) {
				toast.success(response.message);
				setFormData({ ...formData, photo: undefined });
				if (onSuccess) {
					await onSuccess();
				}
			}
		} catch (error) {
			const apiError = error as ApiError;
			toast.error(apiError.message || "Failed to delete image");
		} finally {
			setIsLoading(false);
			setShowDeleteConfirmation(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});

		try {
			const response = await accountService.updateProfile(formData, user!.uuid);
			if (response.success) {
				toast.success(response.message);
				if (onSuccess) {
					await onSuccess();
				}
			}
		} catch (error) {
			const apiError = error as ApiError;
			if (apiError.errors) {
				setErrors(apiError.errors);
			}
			toast.error(apiError.message || "Failed to update profile");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-7xl mx-auto my-3">
			<form onSubmit={handleSubmit}>
				<div className="grid gap-6">
					<div className="space-y-2">
						<Label htmlFor="photo" className="block text-sm font-medium mb-2">
							{t("input.user.photo.label")}
						</Label>

						<UploadImage
							initialImage={user.photo_url}
							onImageUpload={(file) => {
								setFormData({ ...formData, photo: file });
							}}
							onDeleteImage={handleDeleteImage}
						/>

						{errors.photo && (
							<span className="text-sm text-red-500">{errors.photo[0]}</span>
						)}
					</div>

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
						value={formData.email}
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

					<SubmitButton type="submit" className="w-full" isLoading={isLoading}>
						{t("button.common.edit")}
					</SubmitButton>
				</div>
			</form>

			<ConfirmationDialog
				isOpen={showDeleteConfirmation}
				onClose={() => setShowDeleteConfirmation(false)}
				onConfirm={confirmDeleteImage}
				title={t("dialog.deleteImage.title")}
				description={t("dialog.deleteImage.description")}
				confirmText={t("button.common.delete")}
				cancelText={t("button.common.cancel")}
			/>
		</div>
	);
};

export default UpdateProfileForm;
