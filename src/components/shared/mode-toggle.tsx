"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
	const [mounted, setMounted] = React.useState(false);
	const { theme, setTheme } = useTheme();

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon">
				<Sun className="h-[1.2rem] w-[1.2rem]" />
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					{theme === "dark" ? (
						<Moon className="h-[1.2rem] w-[1.2rem]" />
					) : theme === "system" ? (
						<Monitor className="h-[1.2rem] w-[1.2rem]" />
					) : (
						<Sun className="h-[1.2rem] w-[1.2rem]" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => setTheme("light")}
					className="flex justify-between"
				>
					<div className="flex items-center gap-2">
						<Sun className="h-4 w-4" />
						<span>Light</span>
					</div>
					{theme === "light" && <Check className="h-4 w-4" />}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("dark")}
					className="flex justify-between"
				>
					<div className="flex items-center gap-2">
						<Moon className="h-4 w-4" />
						<span>Dark</span>
					</div>
					{theme === "dark" && <Check className="h-4 w-4" />}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("system")}
					className="flex justify-between"
				>
					<div className="flex items-center gap-2">
						<Monitor className="h-4 w-4" />
						<span>System</span>
					</div>
					{theme === "system" && <Check className="h-4 w-4" />}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
