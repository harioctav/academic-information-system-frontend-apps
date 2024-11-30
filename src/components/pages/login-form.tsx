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

export function LoginForm() {
	const t = useTranslations();

	return (
		<Card className="mx-auto w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">{t("pages.login.title")}</CardTitle>
				<CardDescription>{t("pages.login.description")}</CardDescription>
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
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">{t("input.password.label")}</Label>
							<Link
								href="/auth/forgot-password"
								className="ml-auto inline-block text-sm underline"
							>
								{t("button.forgot-password")}
							</Link>
						</div>
						<PasswordInput id="password" />
					</div>
					<Button type="submit" className="w-full">
						{t("button.login")}
					</Button>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								{t("button.or")}
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
	);
}
