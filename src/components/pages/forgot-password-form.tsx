"use client";

import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { forgotPasswordService } from "@/lib/services/auth/forgot.password.service";
import { toast } from "sonner";
import { SubmitButton } from "../ui/submit-button";

type ForgotPasswordForm = {
	email: string;
};

const ForgotPasswordForm = () => {
	const t = useTranslations();
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordForm>();

	const onSubmit = async (data: ForgotPasswordForm) => {
		setIsLoading(true);
		try {
			const response = await forgotPasswordService.forgotPassword(data.email);

			if (response.success) {
				toast.success(response.message);
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : t("messages.error.default");
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">
					{t("pages.auth.forgot-password.title")}
				</CardTitle>
				<CardDescription>
					{t("pages.auth.forgot-password.description")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">{t("input.user.email.label")}</Label>
						<Input
							{...register("email", { required: true, pattern: /^\S+@\S+$/i })}
							id="email"
							type="email"
							placeholder={t("input.user.email.placeholder")}
							disabled={isLoading}
						/>
						{errors.email && (
							<p className="text-sm text-red-500">{errors.email.message}</p>
						)}
					</div>
					<SubmitButton type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? t("button.common.loading") : t("button.auth.recovery")}
					</SubmitButton>
					<div className="mt-4 text-center text-sm">
						<Link href="/auth/login">{t("button.auth.return")}</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default ForgotPasswordForm;
