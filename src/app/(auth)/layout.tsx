import { GuestRoute } from "@/components/guest-route";
import { GuestLayout } from "@/components/layouts/guest-layout";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<GuestRoute>
			<GuestLayout>{children}</GuestLayout>
		</GuestRoute>
	);
}
