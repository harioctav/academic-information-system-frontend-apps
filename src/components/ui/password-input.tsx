"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface PasswordInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: string;
}

export function PasswordInput({ ...props }: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);
	const t = useTranslations();

	return (
		<div className="relative">
			<Input
				type={showPassword ? "text" : "password"}
				{...props}
				placeholder={t("input.user.password.placeholder")}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
				onClick={() => setShowPassword(!showPassword)}
			>
				{showPassword ? (
					<EyeOff className="h-4 w-4 mr-1" />
				) : (
					<Eye className="h-4 w-4 mr-1" />
				)}
			</Button>
		</div>
	);
}
