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
					{t("pages.forgot-password.title")}
				</CardTitle>
				<CardDescription>
					{t("pages.forgot-password.description")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">{t("input.email.label")}</Label>
						<Input
							id="email"
							type="email"
							placeholder={t("input.email.placeholder")}
							required
						/>
					</div>
					<Button type="submit" className="w-full">
						{t("button.recovery")}
					</Button>
				</div>
				<div className="mt-4 text-center text-sm">
					<Link href="/auth/login">{t("button.return")}</Link>
				</div>
			</CardContent>
		</Card>
	);
};

export default ForgotPasswordForm;
