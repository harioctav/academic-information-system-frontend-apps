"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";
import { ApiError } from "@/types/api";
import { forgotPasswordService } from "@/lib/services/auth/forgot.password.service";

const ResetPasswordForm = () => {
	const t = useTranslations();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<{
		password?: string;
		password_confirmation?: string;
	}>({});

	const token = searchParams.get("token");
	const email = searchParams.get("email");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		const formData = new FormData(e.currentTarget);

		setIsLoading(true);
		try {
			const response = await forgotPasswordService.resetPassword({
				token: token as string,
				email: email as string,
				password: formData.get("password") as string,
				password_confirmation: formData.get("password_confirmation") as string,
			});

			if (response.success) {
				toast.success(response.message);
				window.location.href = "/auth/login";
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			const err = error as ApiError;
			if (err.errors) {
				setErrors({
					password: err.errors.password?.[0],
					password_confirmation: err.errors.password_confirmation?.[0],
				});
			}
			toast.error(err.message || t("messages.error.default"));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">
					{t("pages.auth.reset-password.title")}
				</CardTitle>
				<CardDescription>
					{t("pages.auth.reset-password.description")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="password">{t("input.user.password.label")}</Label>
						<PasswordInput
							id="password"
							name="password"
							required
							disabled={isLoading}
							error={errors.password}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password_confirmation">
							{t("input.user.password_confirmation.label")}
						</Label>
						<PasswordInput
							id="password_confirmation"
							name="password_confirmation"
							required
							disabled={isLoading}
							error={errors.password_confirmation}
						/>
					</div>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? t("button.common.loading") : t("button.auth.reset")}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default ResetPasswordForm;
