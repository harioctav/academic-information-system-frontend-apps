import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/shared/themes/theme-provider";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/services/auth/auth-provider";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	display: "swap",
	preload: false,
	variable: "--font-poppins",
	adjustFontFallback: false,
	fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
	title: "Sistem Informasi Akademik Universitas Terbuka",
	description:
		"Portal akademik untuk mahasiswa, dosen, dan staf Universitas Terbuka",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={`${poppins.variable} font-sans antialiased`}>
				<NextIntlClientProvider messages={messages}>
					<AuthProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							<ProgressBar />
							{children}
							<Toaster position="top-right" richColors />
						</ThemeProvider>
					</AuthProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
