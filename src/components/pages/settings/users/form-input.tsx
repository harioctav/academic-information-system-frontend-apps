"use client";

import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { userService } from "@/lib/services/settings/user.service";
import { ApiError, ValidationErrors } from "@/types/api";
import { UserRequest } from "@/types/settings/user";
import { useRouter } from "next/navigation";
import { useEffect, useCallback, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { FormProps } from "@/types/common";
import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { Role } from "@/types/settings/role";
import { getRoleLabel } from "@/config/enums/role.enum";
import { PhoneInput } from "@/components/forms/phone-input";
import { DynamicInput } from "@/components/forms/dynamic-input";
import UploadImage from "@/components/ui/upload-image";

const UserFormInput = ({ uuid, isEdit, onSuccess }: FormProps) => {
	const router = useRouter();
	const t = useTranslations();
	const [formData, setFormData] = useState<UserRequest>({
		name: "",
		email: "",
		phone: "",
		roles: 0,
		photo: undefined,
	});
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isLoading, setIsLoading] = useState(false);
	const [selectedRole, setSelectedRole] = useState<SelectOption<Role> | null>(
		null
	);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const handleDeleteImage = () => {
		setFormData({ ...formData, photo: undefined });
		setImagePreview(null);
	};

	const loadUserData = useCallback(async () => {
		if (!uuid) return;
		try {
			setIsLoading(true);
			const response = await userService.showUser(uuid);

			// Set form data with loaded user data
			setFormData({
				name: response.data.name || "",
				email: response.data.email || "",
				phone: response.data.phone || "",
				roles: response.data.roles?.[0]?.id || 0,
			});

			// Set image preview
			setImagePreview(response.data.photo_url);

			// Set selected role
			if (response.data.roles?.[0]) {
				setSelectedRole({
					value: response.data.roles[0].id,
					label: getRoleLabel(response.data.roles[0].name),
					data: response.data.roles[0],
				});
			}
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to load user data"
			);
		} finally {
			setIsLoading(false);
		}
	}, [uuid]);

	useEffect(() => {
		if (isEdit && uuid) {
			loadUserData();
		}
	}, [isEdit, uuid, loadUserData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});

		try {
			if (isEdit && uuid) {
				const response = await userService.updateUser(uuid, formData);
				if (response.success) {
					toast.success(response.message);
					if (onSuccess) onSuccess();
					router.refresh();
				}
			} else {
				const response = await userService.storeUser(formData);
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
				apiError.message || "An error occurred while saving the User"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto py-3">
			<form onSubmit={handleSubmit}>
				<div className="grid gap-6">
					<div className="space-y-2">
						<Label htmlFor="photo" className="block text-sm font-medium mb-2">
							{t("input.user.photo.label")}
						</Label>

						<UploadImage
							initialImage={imagePreview}
							onImageUpload={(file) => {
								setFormData({ ...formData, photo: file });
								setImagePreview(URL.createObjectURL(file));
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

					<div className="space-y-2">
						<Label htmlFor="roles" className="block text-sm font-medium mb-2">
							{t("input.user.roles.label")}
						</Label>
						<AsyncSelectInput<Role>
							placeholder={t("input.select")}
							apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/settings/roles`}
							value={selectedRole}
							onChange={(newValue) => {
								setSelectedRole(newValue);
								setFormData({ ...formData, roles: newValue?.data.id || 0 });
							}}
							onClear={() => {
								setSelectedRole(null);
								setFormData({ ...formData, roles: 0 });
							}}
							textFormatter={(item) => getRoleLabel(item.name)}
							valueFormatter={(item) => item.id}
							isClearable
						/>
						{errors.roles && (
							<span className="text-sm text-red-500">{errors.roles[0]}</span>
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

export default UserFormInput;
