import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

const ForgotPasswordForm = () => {
	const t = useTranslations();
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
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">{t("input.user.email.label")}</Label>
						<Input
							id="email"
							type="email"
							placeholder={t("input.user.email.placeholder")}
							required
						/>
					</div>
					<Button type="submit" className="w-full">
						{t("button.auth.recovery")}
					</Button>
				</div>
				<div className="mt-4 text-center text-sm">
					<Link href="/auth/login">{t("button.auth.return")}</Link>
				</div>
			</CardContent>
		</Card>
	);
};

export default ForgotPasswordForm;
