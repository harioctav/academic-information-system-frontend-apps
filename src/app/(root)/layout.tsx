import { MainLayout } from "@/components/layouts/main-layout";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <MainLayout>{children}</MainLayout>;
}
