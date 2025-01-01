"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { useAuth } from "@/lib/services/auth/auth-provider";
import { authService } from "@/lib/services/auth/auth.service";
import { SubmitButton } from "@/components/ui/submit-button";
import { ValidationErrors } from "@/types/api";
import { ApiError } from "@/types/auth/auth";

export function LoginForm() {
	const t = useTranslations();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setIsLoading(true);

		try {
			const response = await authService.login({ email, password });
			login(response);
		} catch (error: unknown) {
			const apiError = error as ApiError;
			if (apiError.errors) {
				setErrors(apiError.errors);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Card className="mx-auto w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">
						{t("pages.auth.login.title")}
					</CardTitle>
					<CardDescription>{t("pages.auth.login.description")}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">{t("input.user.email.label")}</Label>
							<Input
								id="email"
								type="email"
								placeholder={t("input.user.email.placeholder")}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							{errors.email && (
								<small className="text-sm text-red-500">
									{errors.email[0]}
								</small>
							)}
						</div>

						{/* <DynamicInput
							type="email"
							name="email"
							label={t("input.common.email.label")}
							value={email}
							onChange={setEmail}
							error={errors.email?.[0]}
							disabled={isLoading}
						/> */}

						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">
									{t("input.user.password.label")}
								</Label>
								<Link
									href="/auth/forgot-password"
									className="ml-auto inline-block text-sm underline"
								>
									{t("button.auth.forgot-password")}
								</Link>
							</div>
							<PasswordInput
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								error={errors.password?.[0]}
							/>
							{errors.password && (
								<small className="text-sm text-red-500">
									{errors.password[0]}
								</small>
							)}
						</div>

						<SubmitButton
							type="submit"
							className="w-full"
							isLoading={isLoading}
							disabled={isLoading}
						>
							{t("button.auth.login")}
						</SubmitButton>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									{t("button.auth.or")}
								</span>
							</div>
						</div>

						<div className="flex gap-4 w-full">
							<Button variant="outline" className="w-full" asChild>
								<Link
									href="/login/google"
									className="flex items-center justify-center"
								>
									<Image
										src="/assets/icons/google.svg"
										alt="Google"
										width={16}
										height={16}
										className="mr-2"
									/>
									Google
								</Link>
							</Button>
							<Button variant="outline" className="w-full" asChild>
								<Link
									href="/login/twitter"
									className="flex items-center justify-center"
								>
									<Image
										src="/assets/icons/twitter.svg"
										alt="Twitter"
										width={16}
										height={16}
										className="mr-2"
									/>
									Twitter
								</Link>
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
