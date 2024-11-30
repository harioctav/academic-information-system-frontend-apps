import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});

const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Sistem Informasi Akademik Universitas Terbuka",
	description:
		"Portal akademik untuk mahasiswa, dosen, dan staf Universitas Terbuka",
	keywords: [
		"sistem informasi akademik",
		"universitas terbuka",
		"portal akademik",
		"sia ut",
		"academic portal",
	],
	authors: [{ name: "Universitas Terbuka" }],
	creator: "Universitas Terbuka",
	publisher: "Universitas Terbuka",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	icons: {
		icon: "/favicon.ico",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
