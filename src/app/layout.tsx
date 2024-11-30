import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/shared/themes/theme-provider";
import { ProgressBar } from "@/components/ui/progress-bar";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
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
					<ProgressBar />
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<div className="bg-background">{children}</div>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
