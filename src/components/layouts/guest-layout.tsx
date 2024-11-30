import { ModeToggle } from "@/components/shared/mode-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export function GuestLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen flex items-center justify-center relative">
			<div className="fixed top-4 right-4 flex items-center gap-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border">
				<ModeToggle />
				<LanguageSwitcher />
			</div>
			<div className="max-w-md w-full space-y-8">{children}</div>
		</div>
	);
}
