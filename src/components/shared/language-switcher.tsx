"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { setCookie } from "cookies-next";

export function LanguageSwitcher() {
	const [currentLocale, setCurrentLocale] = useState("en");
	const router = useRouter();

	const languages = [
		{ label: "Indonesia", locale: "id" },
		{ label: "English", locale: "en" },
	];

	useEffect(() => {
		const cookieLocale = document.cookie.match("locale=([^;]+)");
		setCurrentLocale(cookieLocale?.[1] || "en");
	}, []);

	const handleLanguageChange = (newLocale: string) => {
		setCookie("locale", newLocale, { path: "/" });
		setCurrentLocale(newLocale);
		router.refresh();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Languages className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{languages.map((lang) => (
					<DropdownMenuItem
						key={lang.locale}
						onClick={() => handleLanguageChange(lang.locale)}
						className={currentLocale === lang.locale ? "bg-accent" : ""}
					>
						{lang.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
